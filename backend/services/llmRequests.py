import os
import re
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

def _has_backticks(text: str) -> bool:
    return "`" in text

def _strip_surrounding_backticks(value: str) -> str:
    return value.strip().strip("`").strip()

_DASH_PATTERN = re.compile(r"\s[—–-]\s")

def _wrap_thought(text: str) -> str:
    match = _DASH_PATTERN.search(text)
    if match:
        head = _strip_surrounding_backticks(text[:match.start()])
        tail = _strip_surrounding_backticks(text[match.end():])
        if head and tail:
            return f"`{head}` — {tail}"
        if head:
            return f"`{head}`"
        return tail
    if _has_backticks(text):
        return text
    return f"`{text.strip()}`" if text.strip() else text

def _wrap_pitfall(text: str) -> str:
    if _has_backticks(text):
        return text
    return f"`{text.strip()}`" if text.strip() else text

def _wrap_topics_for_storage(
    topics: dict[str, dict[str, list[str]]],
) -> dict[str, dict[str, list[str]]]:
    wrapped: dict[str, dict[str, list[str]]] = {}
    for topic, payload in (topics or {}).items():
        if not isinstance(payload, dict):
            continue
        thoughts = payload.get("thoughts_to_remember") or []
        pitfalls = payload.get("pitfalls") or []
        wrapped_thoughts = [
            _wrap_thought(t) if isinstance(t, str) else t
            for t in thoughts
        ]
        wrapped_pitfalls = [
            _wrap_pitfall(p) if isinstance(p, str) else p
            for p in pitfalls
        ]
        wrapped[topic] = {
            "thoughts_to_remember": wrapped_thoughts,
            "pitfalls": wrapped_pitfalls,
        }
    return wrapped

def _topic_counts(topics: dict) -> tuple[int, int, int]:
    total_topics = len(topics) if isinstance(topics, dict) else 0
    total_thoughts = 0
    total_pitfalls = 0
    if not isinstance(topics, dict):
        return total_topics, total_thoughts, total_pitfalls
    for payload in topics.values():
        if not isinstance(payload, dict):
            continue
        thoughts = payload.get("thoughts_to_remember") if isinstance(payload, dict) else None
        pitfalls = payload.get("pitfalls") if isinstance(payload, dict) else None
        if isinstance(thoughts, list):
            total_thoughts += len([t for t in thoughts if isinstance(t, str) and t.strip()])
        elif isinstance(thoughts, str) and thoughts.strip():
            total_thoughts += 1
        if isinstance(pitfalls, list):
            total_pitfalls += len([p for p in pitfalls if isinstance(p, str) and p.strip()])
        elif isinstance(pitfalls, str) and pitfalls.strip():
            total_pitfalls += 1
    return total_topics, total_thoughts, total_pitfalls

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
    topics_count, thoughts_count, pitfalls_count = _topic_counts(acc)
    # print(
    #     "guide_mode_disable redis topics="
    #     f"{topics_count} thoughts={thoughts_count} pitfalls={pitfalls_count}"
    # )
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
            "origin": "guidemode",
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
    language: str,
    session_id: str | None = None,
    user_id: str | None = None,
    problem_no: int | None = None,
    problem_name: str | None = None,
    problem_url: str | None = None,
):

    
    system_prompt = """
    You are given:
    - Code
    - Programming language the user is using
    - A fixed Topics JSON (its keys are the ONLY allowed topics)
    Your job:
    1) Produce "resp" with any helpful explanation/corrections.
    2) Produce "topics" with ONLY NEW items, and ONLY if they belong to the correct topic.

    ABSOLUTE RULES FOR "topics" (MANDATORY):
    A) "topics" is for TOPIC-SPECIFIC learnings only.
    - Every item you add must be clearly and directly about that topic’s concept.
    - You can add corrections to be made under "thoughts_to_remember" section of the respective topic
    
    TOPIC PAIR RULE (MANDATORY):
    When adding any item to topics:
        - Each pitfall must be a concrete wrong code fragment (prefer verbatim line from the user's code).
        - Each thoughts_to_remember must be the corrected version + short note:
        "<corrected_line_or_fragment> — <2 to 6 word note>"
        - Do NOT add generic reminders or abstract principles.
        - Prefer fewer, higher-signal pairs (max 3 pairs total across all topics).


    B) STRICT TOPIC ASSIGNMENT:
    - Add an item to a topic ONLY if the mistake/learning is fundamentally about that topic.
    - If not, You can add suggestions on how this Topic can be used to solve this problem.

    C) DEDUPE:
    - Do not repeat or rephrase anything already present in the provided Topics JSON.

    OUTPUT FORMAT (MANDATORY):
    Return ONLY valid JSON (no markdown, no backticks outside strings).
    Schema:
    {
    "resp": string,
    "topics": {
        "<topic>": {
        "thoughts_to_remember": string[],
        "pitfalls": string[]
        }
    }
    }
    CORRECTED CODE RULE (MANDATORY):

    If the code is faulty and a fix is clear,
    you MAY include the fully corrected code.

    Rules for corrected code:
    - Corrected code MUST appear ONLY inside the "resp" string.
    - Corrected code MUST be clearly labeled as "Corrected code:".
    - Do NOT add corrected code to "topics".
    - Do NOT extract learnings from the corrected code unless they are
    strictly topic-specific and pass all topic rules.
    - If multiple fixes are possible, provide ONE reasonable corrected version.

    
    CODE FORMATTING RULE (MANDATORY):

    When including code inside the "resp" string:

    - Wrap the ENTIRE corrected code block in triple backticks (```).
    - Specify the language immediately after the opening backticks (e.g., ```java).
    - Do NOT use backticks anywhere else for code blocks.
    - Inline code identifiers (class names, variables, methods) MUST be wrapped in single backticks (`).
    - Do NOT mix markdown styles.
    - Do NOT place code outside the "resp" string.
    - Do NOT use Markdown table syntax (|, ---).
    - Do NOT present information in rows or columns.


    If there are no NEW topic-specific items to add, return:
    {"resp":"<your resp text>", "topics":{}}

    """

    language_line = f"Preferred language: {language}\n" if language.strip() else ""

    user_prompt = f"""
    
    Code:
    {code}

    programming language: 
    {language_line}

    Topics (JSON — keys are fixed, values contain existing notes):
    {json.dumps(_serialize_topics(topics), indent=2)}

    """

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini-2025-04-14",
            #model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            response_format={"type": "json_object"},
        )

        raw = response.choices[0].message.content or ""
        data = parse_json_response(raw)
        print()
        print("This is the checkmode's raw response: ")
        print()
        print(data)
        print()

        topicNotes = data.get("topics") or {}
        #print("this is topics field: ", topicNotes)
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

        topics_for_storage = _wrap_topics_for_storage(
            data.get("topics") or {}
        )

        if session_id and user_id and problem_no and problem_name and problem_url:
            payload = {
                "user_id": user_id,
                "session_id": session_id,
                "problem_no": problem_no,
                "problem_name": problem_name,
                "problem_url": problem_url,
                "topics": topics_for_storage,
                "response_text": data.get("resp") or "",
                "origin": "checkmode",
            }
            if is_db_write_in_flight():
                #print("checkmode: db write in flight, buffering payload")
                buffer_guide_write(payload)
            else:
                #print("checkmode: writing payload now")
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
        #print("This is the error Error:", e)
        time.sleep(60)
        return str(e)


def guideModeAssist(problem: str, topics: dict[str, TopicNotes], code: str, focusLine: str, language: str, rollingStateGuideMode: RollingStateGuideMode, session_id: str | None = None, user_id: str | None = None):
    problem = problem
    topics = topics
    fullCode = code
    focusBlock = focusLine
    nudgesSoFar = rollingStateGuideMode.nudges
    try:
        nudges_count = len(nudgesSoFar) if nudgesSoFar is not None else 0
        #print("nudges so far: ", nudges_count)
    except TypeError:
        nudges_count = 0
    #print(f"guideModeAssist nudgesSoFar count={nudges_count} nudgesSoFar={nudgesSoFar}")


    system_prompt = """
       You are a SILENT coding mentor.

        You are observing a student solve a LeetCode problem line by line.

        You are given:
        - Full code (context only — DO NOT critique it)
        - Programming language the user is using for this problem
        - A Focus line (the ONLY thing you may evaluate)
        - Topics (existing durable learnings; topic keys are fixed)
        - NudgesRolling (nudges already shown)

        Your default behavior is to stay silent.

        ────────────────────────
        HARD SILENCE RULE (CRITICAL)
        ────────────────────────

        If the Focus block is:
        - Correct, OR
        - Reasonable, OR
        - Incomplete but not wrong yet (placeholder, partial statement, unfinished block), OR
        - Something the student can safely continue building without error

        You MUST return EXACTLY:
        {"nudge":"", "topics":{}}

        DO NOT:
        - Praise the code
        - Say it is correct
        - Explain reasoning
        - Teach concepts
        - Reveal solutions
        - Predict the next step
        - Suggest what to write next
        - Mention missing future code (e.g., “handle X later”, “add a return after this”)
        - Give multi-step or forward-looking guidance

        Silence is success.

        ────────────────────────
        WHEN YOU ARE ALLOWED TO SPEAK (ONLY THESE)
        ────────────────────────

        You may respond ONLY if the Focus block ITSELF introduces a concrete, present issue that will:

        1) FAIL TO COMPILE (syntax / compilation error)
        2) USE AN INVALID OR NON-EXISTENT API OR METHOD
        3) CAUSE A TYPE MISMATCH
        4) CAUSE DEFINITE INCORRECT BEHAVIOR already determined by THIS line
        5) CAUSE A PROVABLE STRUCTURAL DEFECT introduced by THIS line alone

        A “structural defect” means:
        - This line guarantees incorrect iteration (skip, duplicate, infinite loop), OR
        - This line forces unnecessary extra passes that are unavoidable due to this structure

        Allowed structural examples:
        - Loop bounds that already skip indices
        - Loop structure that prevents true alternation in this problem
        - Pointer movement that guarantees rework or incorrect ordering
        - Suggesting a different loop just because it’s cleaner
        - Recommending Math.min unless the current line already causes redundancy

        NOT allowed as structural issues:
        - Suggesting a different approach without a provable downside from THIS line
        - Suggesting future steps or missing logic

        If none apply, remain silent:
        {"nudge":"", "topics":{}}

        ────────────────────────
        ANTI-PREEMPTION RULE (NEW – CRITICAL)
        ────────────────────────

        You MUST NOT:
        - Tell the student what to do next
        - Comment on logic that has not yet been written
        - Warn about missing code that is not required yet
        - Anticipate future branches, returns, or edge cases

        ONLY judge the Focus block in isolation.

        ────────────────────────
        DEDUPLICATION (HARD CONSTRAINT)
        ────────────────────────

        Before generating any output, you MUST check:

        A) NudgesRolling
        - If the nudge you are about to output has the SAME meaning as ANY prior nudge
        (even if phrased differently), return silent JSON.

        B) Topics
        - If the concept already exists anywhere in Topics
        (thoughts_to_remember OR pitfalls), return silent JSON.

        If unsure whether it is new → STAY SILENT.

        Silent JSON:
        {"nudge":"", "topics":{}}

        You are not allowed to repeat yourself.

        ────────────────────────
        NUDGE RULES (STRICT)
        ────────────────────────

        If you respond:
        - Output EXACTLY ONE nudge
        - ONE LINE only
        - Imperative, corrective tone (Fix…, Replace…, Use…, Prefer…)
        - NO explanations
        - NO reasoning
        - NO multiple actions
        - NO next steps
        - NO formatting, NO markdown
        - Do NOT use Markdown table syntax (|, ---).
        - Do NOT present information in rows or columns.

        Corrected line rule:
        - If the issue is syntax/API/type related, include ONLY the corrected Focus line verbatim.
        - Do NOT include surrounding code.
        - If the fix requires more than one line, DO NOT speak.

        Structural nudge rule:
        - If structural, provide direction only (no code).
        - Must be attributable solely to the Focus line.
        - Must not mention future actions.

       ────────────────────────
        TOPICS OUTPUT RULES (REVISED)
        ────────────────────────

        Topics are a durable "mistake → correction" memory.

        Only when you output a NON-EMPTY nudge:
        - You MAY add topic updates.

        You must add EXACTLY ONE pair (1 pitfall + 1 thought) for the affected topic, IF it is new.

        PAIR FORMAT (MANDATORY):
        A) pitfalls: store the student's WRONG Focus line verbatim.
        - Must be EXACTLY the Focus line as provided (trim whitespace only).
        - No extra commentary.
        - No general statements (e.g., "Java is case-sensitive") allowed.

        B) thoughts_to_remember: store the corrected line + a short note.
        - Must be ONE LINE.
        - Format exactly:
        "<corrected_focus_line> — <2 to 6 word note>"
        - The corrected_focus_line must be the fixed version of the Focus line ONLY.
        - The note must be minimal (examples: "correct casing", "use .toString()", "fix method name", "fix type").

        C) CODE FORMATTING RULE (MANDATORY):
        - The code portion of BOTH pitfalls and thoughts_to_remember MUST be wrapped in single backticks (`).
        - Only the code is wrapped in backticks — NOT the note text.
        - Do NOT use triple backticks.
        - Do NOT use Markdown tables or columns.


        CONSTRAINTS:
        1) Use ONLY existing topic keys (DO NOT invent new topics).
        2) Add entries ONLY for the single most relevant topic.
        3) If the fix cannot be expressed as ONE corrected line, do NOT add topics and do NOT speak.
        4) If this pair already exists in any topic (either wrong line or corrected line meaning), return silent JSON.
        5) Do NOT add “principles”, “rules”, or “reminders”. Only the pair.


        ────────────────────────
        OUTPUT FORMAT (MANDATORY)
        ────────────────────────

        Return ONLY valid JSON.
        No markdown.
        No backticks.
        No extra text.

        Schema:
        {
        "nudge": string,
        "topics": {
            "<existing_topic_key>": {
            "pitfalls": string[],
            "thoughts_to_remember": string[]
            }
        }
        }

        If silent:
        {"nudge":"", "topics":{}}
        """

    language_line = f"Preferred language: {language}\n" if language.strip() else ""

    user_prompt = f"""
    Guide mode input.

    Leetcode Problem: {problem}

    Programming language: {language_line}
    Full code: {fullCode}

    Focus block: {focusBlock}

    Topics (JSON — keys are fixed, values contain existing notes): {json.dumps(_serialize_topics(topics), indent=2)}

    NudgesRolling: {nudgesSoFar}

    """

    try:
        #print("these are the nudges given so far: ", nudgesSoFar)
        response = client.chat.completions.create(
            # model="gpt-3.5-turbo",
            # model="deepseek-reasoner",
            model="gpt-4.1-mini-2025-04-14", # this made all the differnece! consider using groq
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
                
            ],
            response_format={"type": "json_object"},
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
            enabled = r.get(enabled_key)
            if enabled:
                topics_key = rkey("guide:topics", user_id, session_id)
                incoming = data.get("topics") or {}
                incoming = _wrap_topics_for_storage(incoming)
                topics_count, thoughts_count, pitfalls_count = _topic_counts(incoming)
                # print(
                #     "guideModeAssist redis merge topics="
                #     f"{topics_count} thoughts={thoughts_count} pitfalls={pitfalls_count}"
                # )
                r.eval(_LUA_MERGE_TOPICS, 1, topics_key, json.dumps(incoming), str(GUIDE_TTL_SECONDS))
            else:
                print("guideModeAssist redis merge skipped: guide not enabled")
        # #print("LLM data: ", data)
        

        return data

    except Exception as e:
        print("Error:", e)
        time.sleep(60)
        return {"nudge": "Error calling model.", "thoughts_to_remember": [], "state_update": {}}

def answerAskanything(
    rollingHistory: list[str],
    summary: str,
    query: str,
    language: str = "",
):
    system_prompt = """
    You are an Assistant that helps the user with DSA problems and programming questions.

    You are given:
    - A summarized context of earlier conversation windows (if provided)
    - The recent conversation history
    - The user's current question

    Formatting rules:
    - Do NOT use Markdown table syntax (|, ---).
    - Do NOT present information in rows or columns.

    Use the summary only as background context.
    Prioritize the recent conversation history and the current question.

    If the user asks anything outside programming or DSA problem solving, reply exactly:
    "This is not my scope."
    """

    history_text = "\n".join(rollingHistory)

    language_line = f"Preferred language: {language}\n" if language.strip() else ""

    user_prompt = f"""
    {"Earlier summarized context:\n" + summary if summary.strip() else ""}

    Recent conversation:
    {history_text}

    I am writing code in {language_line}

    question:
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
    
    system_prompt = """
    You are a summarizer that condenses a user’s learning history into a QUICK-GLANCE checklist.

        You will receive:
        - Notes: concrete “to remember” items collected during solving
        - Pitfalls: concrete mistakes the user actually made

        CRITICAL GOAL
        The summary must reflect ONLY what appears in the input.
        Do NOT introduce new concepts, advice, or patterns that are not directly implied by the given points.

        MENTAL MODEL
        This is a compressed diff of:
        - what went wrong
        - what fixed it

        RULES (STRICT)
        1) Do NOT invent new learnings.
        2) Do NOT generalize beyond the scope of the input.
        3) Every summary bullet must be traceable to at least one input item.
        4) Merge duplicates, but NEVER add new ideas.
        5) Keep items SHORT and SCANNABLE (glanceable in 2–3 seconds).

        CONTENT STYLE
        - Pitfalls should resemble the mistake itself (code-like or specific).
        - Notes should resemble the fix or rule that corrected it.
        - Prefer concrete over abstract.
        - Long-term DSA principles are OPTIONAL and allowed ONLY if clearly supported by the input.

        FORMAT RULES
        - notes_summary: 3–7 bullets
        - pitfalls_summary: 3–7 bullets
        - Each bullet: 6–14 words
        - Start bullets with verbs when possible.
        - No numbering.
        - No headings.
        - No explanations.
        - No examples.
        - Do NOT use Markdown table syntax (|, ---).
        - Do NOT present information in rows or columns.

        OUTPUT
        Return ONLY valid JSON with exactly:

        {
        "notes_summary": string[],
        "pitfalls_summary": string[]
        }
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
            model="gpt-4.1-mini-2025-04-14",
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
