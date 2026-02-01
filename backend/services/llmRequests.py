import os
import time
from datetime import datetime, timezone
from dotenv import load_dotenv
from openai import OpenAI
from models import RollingStateGuideMode, TopicNotes
from pydantic import BaseModel
import json
from services.dataProcessor import processingSimilarInputTopic, processingSimilarInputNudges
from services.dbWriter import write_checkmode_result_v2, buffer_guide_write, flush_guide_buffer, is_db_write_in_flight
from services.redisClient import r, rkey, set_json, get_json

load_dotenv()

client = OpenAI()
# implement the code here to validate the session Id

GUIDE_TTL_SECONDS = 2 * 60 * 60  # 2 hours

_LUA_MERGE_TOPICS = """
local key = KEYS[1]
local incoming = cjson.decode(ARGV[1])
local ttl = tonumber(ARGV[2])

local current = redis.call("GET", key)
local acc = {}
if current then
  acc = cjson.decode(current)
end

for topic, payload in pairs(incoming) do
  if type(payload) == "table" then
    if acc[topic] == nil then
      acc[topic] = { thoughts_to_remember = {}, pitfalls = {} }
    end
    local entry = acc[topic]
    local thoughts = payload["thoughts_to_remember"]
    if type(thoughts) == "string" then
      table.insert(entry["thoughts_to_remember"], thoughts)
    elseif type(thoughts) == "table" then
      for _, v in ipairs(thoughts) do
        if type(v) == "string" and v ~= "" then
          table.insert(entry["thoughts_to_remember"], v)
        end
      end
    end
    local pitfalls = payload["pitfalls"]
    if type(pitfalls) == "string" then
      table.insert(entry["pitfalls"], pitfalls)
    elseif type(pitfalls) == "table" then
      for _, v in ipairs(pitfalls) do
        if type(v) == "string" and v ~= "" then
          table.insert(entry["pitfalls"], v)
        end
      end
    end
  end
end

redis.call("SET", key, cjson.encode(acc), "EX", ttl)
return 1
"""

def _format_guide_summary(acc: dict[str, dict[str, list[str]]]) -> str:
    lines: list[str] = ["Guide mode summary:"]
    for topic_name, payload in acc.items():
        thoughts = payload.get("thoughts_to_remember") or []
        pitfalls = payload.get("pitfalls") or []
        total = len(thoughts) + len(pitfalls)
        lines.append(f"- {topic_name}: {total} notes")
    return "\n".join(lines)

def guide_mode_enable(
    session_id: str,
    user_id: str,
    problem_no: int | None,
    problem_name: str,
    problem_url: str,
) -> None:
    enabled_key = rkey("guide:enabled", user_id, session_id)
    meta_key = rkey("guide:meta", user_id, session_id)
    topics_key = rkey("guide:topics", user_id, session_id)

    r.set(enabled_key, "1", ex=GUIDE_TTL_SECONDS)
    set_json(meta_key, {
        "problem_no": problem_no,
        "problem_name": problem_name,
        "problem_url": problem_url,
    }, ex=GUIDE_TTL_SECONDS)

    if not r.exists(topics_key):
        set_json(topics_key, {}, ex=GUIDE_TTL_SECONDS)
    else:
        r.expire(topics_key, GUIDE_TTL_SECONDS)

def guide_mode_disable(
    session_id: str,
    user_id: str,
    problem_no: int | None,
    problem_name: str,
    problem_url: str,
) -> None:
    enabled_key = rkey("guide:enabled", user_id, session_id)
    meta_key = rkey("guide:meta", user_id, session_id)
    topics_key = rkey("guide:topics", user_id, session_id)

    acc = get_json(topics_key) or {}
    if not acc:
        r.delete(enabled_key, meta_key, topics_key)
        return
    buffer_guide_write(
        {
            "user_id": user_id,
            "session_id": session_id,
            "problem_no": problem_no,
            "problem_name": problem_name,
            "problem_url": problem_url,
            "topics": acc,
            "response_text": _format_guide_summary(acc),
        }
    )
    flush_guide_buffer()
    r.delete(enabled_key, meta_key, topics_key)

def get_token_usage(response) -> dict:
    usage = getattr(response, "usage", None)
    if not usage:
        return {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0}
    return {
        "prompt_tokens": getattr(usage, "prompt_tokens", 0) or 0,
        "completion_tokens": getattr(usage, "completion_tokens", 0) or 0,
        "total_tokens": getattr(usage, "total_tokens", 0) or 0,
    }

def log_token_usage(label: str, usage: dict) -> None:
    print(
        f"{label} token usage - prompt: {usage['prompt_tokens']}, "
        f"completion: {usage['completion_tokens']}, total: {usage['total_tokens']}"
    )
def requestingCodeCheck(
    topics: dict[str, TopicNotes],
    code: str,
    session_id: str | None = None,
    user_id: str | None = None,
    problem_no: int | None = None,
    problem_name: str | None = None,
    problem_url: str | None = None,
):

    system_prompt = """
    Given the following code, perform checks.
    If faulty, explain why, which line causes it, and how to fix it.

    Go through the Topics JSON part, and for the faulty lines or logic, add the faulty line under pitfalls of the respective topic you seem fit, and add the correction under thoughts_to_remember

    Return the response in the following format:

        Schema:
        "resp": string,
        "topics": {                             // ONLY new items
            "<topic>": {
                "thoughts_to_remember": string[],
                "pitfalls": string[]
            }
        }

    """
    user_prompt = f"""
    
    Code:
    {code}

    Topics (JSON — keys are fixed, values contain existing notes):
    {json.dumps(_serialize_topics(topics), indent=2)}

    """

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini-2025-04-14",
            #model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]
        )

        raw = response.choices[0].message.content or ""
        data = parse_json_response(raw)


        topicNotes = data.get("topics") or {}
        isSimilar = False
        if topicNotes:
            deduped = processingSimilarInputTopic(
                topicNotes, topics
            )
            if deduped is True:
                isSimilar = True
                data["topics"] = {}
                data["topictoprint"] = topicNotes
            else:
                data["topics"] = deduped
        data["isSimilar"] = isSimilar

        if session_id and user_id and problem_no and problem_name and problem_url:
            payload = {
                "user_id": user_id,
                "session_id": session_id,
                "problem_no": problem_no,
                "problem_name": problem_name,
                "problem_url": problem_url,
                "topics": data.get("topics") or {},
                "response_text": data.get("resp") or "",
            }
            if is_db_write_in_flight():
                buffer_guide_write(payload)
            else:
                write_checkmode_result_v2(**payload)
        else:
            return{
                "success": False,
                "error": "Missing required metadata for persistence",
                "details": {
                    "session_id": bool(session_id),
                    "user_id": bool(user_id),
                    "problem_no": bool(problem_no),
                    "problem_name": bool(problem_name),
                    "problem_url": bool(problem_url),
                },
            }

        return data

    except Exception as e:
        print("This is the error Error:", e)
        time.sleep(60)
        return str(e)


def guideModeAssist(problem: str, topics: dict[str, TopicNotes], code: str, focusLine: str, rollingStateGuideMode: RollingStateGuideMode, session_id: str | None = None, user_id: str | None = None):
    problem = problem
    topics = topics
    fullCode = code
    focusBlock = focusLine
    nudgesSoFar = rollingStateGuideMode.nudges
#    - Place it into EXACTLY ONE relevant topic array
    system_prompt = """
    You are a tutor guide that helps a student write meaningful, time and space efficient code.
    You will do this by monitoring each focus line sent to you, along with a code block the focus line lies within.

    ────────────────────────
    OUTPUT FORMAT (MANDATORY)
    ────────────────────────

    Return ONLY valid JSON.
    No markdown.
    No backticks.
    No extra text.

    Schema:
    "nudge": string,                        // "" if no nudge
    "topics": {                             // ONLY new items
        "<topic>": {
            "thoughts_to_remember": string[],
            "pitfalls": string[]
        }
    }

    Use the key name exactly as shown: "topics" (do not use "topics_update").

    ALWAYS output both arrays for any topic you include (even if one is empty).
    If a topic has no NEW items, do not include that topic key at all in the output.

    If you do not find any errors in the focus line OR you have nothing NEW to add,
    return exactly:
    {"nudge":"", "topics":{}}

    If you do find any errors in the focus line sent, do as following:

    1) Go through the "thoughts_to_remember" and the "pitfalls" section under each of the topic
    and see if the issue has already been addressed.
    - Each pitfall has its corresponding thoughts_to_remember
    IMPORTANT: Do NOT repeat or rephrase anything already present in the provided Topics JSON
    or in the "nudges so far". If it already exists (or is essentially the same idea),
    output nothing new for it.

    2) Stick to the topics given in the input and DO NOT invent new topics.

    3) Go through the "nudges field provided".

    4) The nudge MUST include the fully corrected line (verbatim) in the same line.
        Example: Focus line: "Stringbuilder st = stringbuilder();" -> nudge: "Use StringBuilder st = new StringBuilder(); because Java is case-sensitive and constructors require new."

    5) If not syntax related, but if you think the focus line can cause long term issues,
    provide a 1 liner nudge to tell the user what they can do instead.

    6) The nudges should be 1 line, short and precise.
    The "nudge" must be a SINGLE LINE string:
    no newline characters, no markdown, no backticks, no code fences.

    7) Now that the issue is addressed by you, there is a "pitfalls" field under each respective topic:
    - For the topic you are providing a nudge on, first fill the pitfalls section with what the user has done, including the input.
    - Next in the "thoughts_to_remember" section of the same topic, provide a solution for it.
    - Both the "pitfalls" and the "thoughts_to_remember" should be a 1 liner, short and precise.

    REMEMBER: You are preparing this student to get better at solving leetcode problems.
    """

    user_prompt = f"""
    Guide mode input.

    Full code
    {fullCode}

    Focus block:
    {focusBlock}

    Topics (JSON — keys are fixed, values contain existing notes):
    {json.dumps(_serialize_topics(topics), indent=2)}

    Nudges so far:
    {nudgesSoFar}

    """

    try:
        response = client.chat.completions.create(
            # model="gpt-3.5-turbo",
            model="gpt-4.1-mini-2025-04-14", # this made all the differnece! consider using groq
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            # temperature=0.2,
        )
        #log_token_usage("guide-mode", get_token_usage(response))
        

        raw = response.choices[0].message.content or ""
        data = parse_json_response(raw)


        topicNotes = data.get("topics") or {}
        isSimilar = False
        if topicNotes:
            deduped = processingSimilarInputTopic(
                topicNotes, topics
            )
            if deduped is True:
                isSimilar = True
                data["topics"] = {}
                data["topictoprint"] = topicNotes
            else:
                data["topics"] = deduped
        data["isSimilar"] = isSimilar
           
        
        nudges = data.get("nudge")
        isSimilarNudges = False
        if nudges:
            isSimilarNudges = processingSimilarInputNudges(rollingStateGuideMode, nudges)
        if isSimilarNudges:
            data["nudge"] = ""
            data["nudgediscarded"] = nudges

        data["isSimilarNudges"] = isSimilarNudges
        if session_id and user_id:
            enabled_key = rkey("guide:enabled", user_id, session_id)
            if r.get(enabled_key):
                topics_key = rkey("guide:topics", user_id, session_id)
                incoming = data.get("topics") or {}
                r.eval(_LUA_MERGE_TOPICS, 1, topics_key, json.dumps(incoming), str(GUIDE_TTL_SECONDS))
        #print("LLM data: ", data)
        

        return data

    except Exception as e:
        print("Error:", e)
        time.sleep(60)
        return {"nudge": "Error calling model.", "thoughts_to_remember": [], "state_update": {}}

def answerAskanything(rollingHistory: list[str], summary: str, query: str):
    system_prompt = """
    You are an Assistant that helps the user with Leetcode problems and programming questions.

    You are given:
    - A summarized context of earlier conversation windows (if provided)
    - The recent conversation history
    - The user's current question

    Use the summary only as background context.
    Prioritize the recent conversation history and the current question.

    If the user asks anything outside programming or Leetcode, reply exactly:
    "This is not my scope."
    """

    history_text = "\n".join(rollingHistory)

    user_prompt = f"""
    {"Earlier summarized context:\n" + summary if summary.strip() else ""}

    Recent conversation:
    {history_text}

    User question:
    {query}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini-2025-04-14",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )

        content = response.choices[0].message.content
        return content.strip() if content else ""

    except Exception as e:
        print("Error:", e)
        time.sleep(60)
        return str(e)


def requestSummarization(summary: str, summarize: list[str]) -> str:
    if not summarize:
        return ""

    system_prompt = """
    You summarize conversations.

    You may be given:
    - An existing summary from earlier conversation windows
    - A new segment of conversation history

    Your task is to produce a single, updated summary that:
    - Preserves important context from the existing summary (if provided)
    - Incorporates new relevant information from the recent conversation
    - Stays concise and precise (3–6 sentences total)

    Include:
    - what the user asked
    - what the assistant responded
    - any conclusions or outcomes

    Do NOT quote the conversation.
    Do NOT add new information.
    Do NOT repeat redundant details.
    """

    user_prompt = f"""
    {"Existing summary:\n" + summary if summary.strip() else ""}

    Recent conversation history:
    {chr(10).join(summarize)}

    Write the updated recap:
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
            max_tokens=180,
        )

        content = response.choices[0].message.content
        return content.strip() if content else ""

    except Exception as e:
        print("Summarization error:", e)
        return ""


def summarize_topic_notes(notes: list[str], pitfalls: list[str]) -> dict[str, str]:
    #print("summarize_topic_notes pitfalls:", pitfalls)
    if not notes and not pitfalls:
        return {"notes_summary": "", "pitfalls_summary": ""}
    
    # system_prompt = """
    # You summarize learning notes for a programming topic.

    # You will receive:
    # - Notes (things to remember)
    # - Pitfalls (common mistakes)

    # Produce a concise, set of points from the content, that provides important insights that will help students to solve DSA problems

    # Points for each, 3-6 sentences max.
    # Return ONLY valid JSON with this exact schema:
    # {"notes_summary": "...", "pitfalls_summary": "..."}
    # """
    system_prompt = """
    You are a summarizer that converts noisy, repetitive learning logs into a clean study checklist.

    You will receive two lists:
    - Notes (things to remember)
    - Pitfalls (common mistakes)

    GOAL
    Produce the same level of output as a human would write:
    - de-duplicated
    - short
    - readable
    - action-oriented
    - generalized (not tied to one problem unless unavoidable)

    RULES
    1) Do NOT copy sentences verbatim from the input. Rewrite and abstract.
    2) Merge repeated or near-duplicate ideas into ONE point.
    3) Keep only high-signal items (skip trivial restatements).
    4) Prefer "principles" + "common failure modes" (indexing, bounds, loop direction, API usage, etc.).
    5) Output format:
    - notes_summary: 5–10 bullet points, each 8–18 words, starting with a verb (e.g., "Use", "Avoid", "Check").
    - pitfalls_summary: 5–10 bullet points, same style.
    6) Do not include numbering, headings, or extra keys.
    7) Return ONLY valid JSON with exactly:
    {"notes_summary": [...], "pitfalls_summary": [...]}
    Where both values are arrays of strings. No markdown. No trailing commentary.
    """


    notes_block = "\n".join(f"- {n}" for n in notes if n)
    pitfalls_block = "\n".join(f"- {p}" for p in pitfalls if p)
    user_prompt = f"""
    Notes:
    {notes_block if notes_block else "(none)"}

    Pitfalls:
    {pitfalls_block if pitfalls_block else "(none)"}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )
        raw = response.choices[0].message.content or ""
        raw1 = parse_json_response(raw)
        try:
            data = parse_json_response(raw)
            return {
                "notes_summary": str(data.get("notes_summary") or "").strip(),
                "pitfalls_summary": str(data.get("pitfalls_summary") or "").strip(),
            }
        except Exception:
            return {
                "notes_summary": raw.strip(),
                "pitfalls_summary": "",
            }
    except Exception as e:
        print("Topic summarization error:", e)
        return {"notes_summary": "", "pitfalls_summary": ""}


def _serialize_topics(topics: dict[str, TopicNotes]) -> dict[str, dict]:
    serialized: dict[str, dict] = {}
    for key, value in topics.items():
        if isinstance(value, BaseModel):
            serialized[key] = value.model_dump()
        else:
            serialized[key] = value
    return serialized


def parse_json_response(text: str) -> dict:
    text = (text or "").strip()

    # handle accidental ```json ... ``` wrappers
    if text.startswith("```"):
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            text = text[start:end+1]

    return json.loads(text)


# in the summarixe_topic_notes function, sometime's the raw data is like this:
# this is the response from the llm:  {"notes_summary": "Reversing words in a string can be efficiently done using a two-pointer approach to reverse in place, saving space. When merging or alternating characters from two strings, iterating up to the minimum length prevents index errors, while appending the remaining substring of the longer string ensures completeness. Alternatively, iterating up to the maximum length with conditional checks can handle different string lengths safely. Using Math.min to determine loop limits is a reliable way to avoid out-of-bounds exceptions. In Python, avoid unnecessary semicolons and ensure variables are printed correctly without quotes or typos.", "pitfalls_summary": "Common mistakes include iterating only up to the minimum length without appending leftover characters, causing incomplete merging. Incorrect length comparisons, such as using equality checks instead of minimum length, lead to index errors or missing data. Using incorrect syntax like 'word1.length' instead of 'word1.length()' or typos in print statements can cause runtime errors or unexpected output. Additionally, printing string literals instead of variable values and unnecessary semicolons in Python code reduce code correctness


# so the lines "notes_summary": str(data.get("notes_summary") or "").strip(),
#                 "pitfalls_summary": str(data.get("pitfalls_summary") or "").strip(),
# wont work because data.get wont get the pitfalls.

