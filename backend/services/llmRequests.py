import os
import time
from dotenv import load_dotenv
from openai import OpenAI
from models import RollingStateGuideMode
import json
from services.dataProcessor import processingSimilarInputTopic, processingSimilarInputNudges

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
def requestingCodeCheck(code: str):
    prompt = f"""

    Given the following code, perform checks.
    If faulty, explain why, which line causes it, and how to fix it.

    Code:
    {code}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )
        #log_token_usage("check-code", get_token_usage(response))

        content = response.choices[0].message.content
        #print("this is the response: ", response)
        return content.strip() if content else ""

    except Exception as e:
        print("This is the error Error:", e)
        time.sleep(60)
        return str(e)

def answerAskanything(code: str):
    prompt = f"""
    Given the following query, answer the query.

    query:
    {code}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
        )
        #log_token_usage("ask-anything", get_token_usage(response))

        content = response.choices[0].message.content
        #print("this is the response: ", response)
        return content.strip() if content else ""

    except Exception as e:
        print("Error:", e)
        time.sleep(60)
        return str(e)
    


def guideModeAssist(problem: str, topics: dict, code: str, focusLine: str, rollingStateGuideMode: RollingStateGuideMode):
    problem = problem
    topics = rollingStateGuideMode.topics
    fullCode = code
    focusBlock = focusLine
    nudgesSoFar = rollingStateGuideMode.nudges
#    - Place it into EXACTLY ONE relevant topic array
    system_prompt = """
    You are a coding guide.
    
    Your job is to give minimal, precise guidance while a user is solving a Leetcode coding problem.
    
    You are given:
    - Full code
    - A Focus block (the most recent meaningful edit)
    - Nudges present
    - Topics with existing notes



    ────────────────────────
    STRICT RULES (MANDATORY)
    ────────────────────────

    1. If the user is on the right track, return an empty response:
    - nudge = ""
    - topics = all topic arrays empty

    2. If you give a non-empty nudge, you MUST:
    - Only produce a nudge if the Focus block introduces a NEW mistake. If the mistake is already present in RollingStateGuideMode, return empty.
    - Actual nudges when it comes to problem solving thinking
    - For nudges, help the user in their thinking process by suggesting them the correct method to follow to solve the problem
    


    3. Only write into topic keys that already exist in the input topics.
    - Do NOT invent new topic keys
    - Add topic-wise tips not related to the problem
    - The knowledge points should not be a result of the problem context, but general knowldge pertaining to this data structure
    - only if a mistake reveals a conceptual gap that the user could use keeping note of
    - One-line factual statements
    - Key notes that can be provided to the user regarding this topic not just specific to the problem
    - Written as neutral facts, not advice or commands
    - Keep tips short, principle-based, and non-procedural.

    STRICT OUTPUT RULE:
    - The "topics" object MUST contain ONLY keys from the provided Topics JSON.
    - Do NOT invent new keys (no “Syntax”).
    - If no topic applies, return the same keys with empty arrays.

    Example output shape (keys are fixed by input):
    {
    "nudge": "",
    "topics": {
        "two_pointers": [],
        "string": ["Two pointers work well when input is sorted."],
        "binary_tree": []
    }
    }


    4. Focus ONLY on the Focus block and how it affects correctness or progress.
    - Do NOT rewrite code
    - Do NOT give full solutions
    - Do NOT ask questions like “what’s next”

    5. Nudges must be short (1–2 lines max) and focus on reasoning or risk,
    NOT syntax trivia or style unless it blocks correctness.

    ────────────────────────
    ROLLING HISTORY & DE-DUPLICATION
    ────────────────────────

    Before writing ANY content, you MUST check RollingStateGuideMode:

    - rollingStateGuideMode.nudges
    - rollingStateGuideMode.topics (all topic arrays)

    DE-DUPLICATION RULES:
    - If the same or very similar idea already exists in the rolling state,
    DO NOT repeat it.
    - If the user repeats the SAME mistake, you may add ONE NEW nuance only.
    - If unsure whether something already exists, assume it exists and return empty.

    ANTI-REPETITION SAFETY:
    - Never rephrase old advice just to sound different.
    - Only add content if it is genuinely NEW.

    DO NOT repeat existing values.

    ────────────────────────
    DELTA-ONLY OUTPUT
    ────────────────────────

    Your output must contain ONLY NEW items to append.
    Do NOT re-list existing items from RollingStateGuideMode.

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
        "<topic>": string[]    // max 1–2 short bullets
    }


    All strings must be concise.
    """

    user_prompt = f"""
    Guide mode input.

    Full code
    {fullCode}

    Focus block:
    {focusBlock}

    Topics (JSON — keys are fixed, arrays contain existing notes):
    {json.dumps(topics, indent=2)}

    Nudges so far:
    {nudgesSoFar}

    """

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            temperature=0.2,
        )
        log_token_usage("guide-mode", get_token_usage(response))
        

        raw = response.choices[0].message.content or ""
        data = parse_json_response(raw)

        topicNotes = data.get("topics") or {}
        isSimilar = False
        if topicNotes:
            isSimilar = processingSimilarInputTopic(rollingStateGuideMode, topicNotes)
        if isSimilar:
            data["topics"] = {}
            data["topictoprint"] = topicNotes
        data["isSimilar"] = isSimilar
           
        
        nudges = data.get("nudge")
        isSimilarNudges = False
        if nudges:
            isSimilarNudges = processingSimilarInputNudges(rollingStateGuideMode, nudges)
        if isSimilarNudges:
            data["nudge"] = ""
            data["nudgediscarded"] = nudges

        data["isSimilarNudges"] = isSimilarNudges
        print("LLM data: ", data)
        

        return data

    except Exception as e:
        print("Error:", e)
        time.sleep(60)
        return {"nudge": "Error calling model.", "thoughts_to_remember": [], "state_update": {}}


def parse_json_response(text: str) -> dict:
    text = (text or "").strip()

    # handle accidental ```json ... ``` wrappers
    if text.startswith("```"):
        start = text.find("{")
        end = text.rfind("}")
        if start != -1 and end != -1:
            text = text[start:end+1]

    return json.loads(text)

