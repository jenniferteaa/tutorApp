import os
import time
from dotenv import load_dotenv
from openai import OpenAI
from models import RollingStateGuideMode, TopicNotes
from pydantic import BaseModel
import json
from services.dataProcessor import processingSimilarInputTopic, processingSimilarInputNudges
from services.dbWriter import write_checkmode_result_v2

load_dotenv()

client = OpenAI()
# implement the code here to validate the session Id
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

    Go through the Topics JSON part, and for the faulty lines or logic, add the faulty 
    line under pitfalls of the respective topic you seem fit, and add the correction under thoughts_to_remember

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
            write_checkmode_result_v2(
                user_id=user_id,
                session_id=session_id,
                problem_no=problem_no,
                problem_name=problem_name,
                problem_url=problem_url,
                topics=data.get("topics") or {},
                response_text=data.get("resp") or "",
            )
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


def guideModeAssist(problem: str, topics: dict[str, TopicNotes], code: str, focusLine: str, rollingStateGuideMode: RollingStateGuideMode, user_id: str | None = None):
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
