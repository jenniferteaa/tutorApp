import os
import time
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI()

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

        content = response.choices[0].message.content
        #print("this is the response: ", response)
        return content.strip() if content else ""

    except Exception as e:
        print("Error:", e)
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

        content = response.choices[0].message.content
        #print("this is the response: ", response)
        return content.strip() if content else ""

    except Exception as e:
        print("Error:", e)
        time.sleep(60)
        return str(e)
    
def guideModeAssist(code: str, focusLine: str):
    fullCode = code
    focusBlock = focusLine

    system_prompt = """
You are a coding guide.

Rules you MUST follow:
- If the user is on the right track, say NOTHING.
- If something is wrong or risky, give a short, precise nudge (1–2 lines max).
- Do NOT give solutions or rewrite code.
- Do NOT ask questions like “what’s next”.
- Extract key insights into a section called "Thoughts to remember".
- "Thoughts to remember" must be short bullet points, no explanations.
- Keep responses minimal and focused on reasoning, not syntax.
"""

    user_prompt = f"""
Guide mode input.

Full code:
{fullCode}

Focus block:
{focusBlock}
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
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


# def guideModeAssist(code: str, focusLine: str):

#     fullCode = code
#     focusBlock = focusLine

#     prompt = f"""
#     You will now be a guide for me, I will send you pieces of code. 
#     I will first send you the skeleton and the the later 
#     snippets i am going to send you will be in context to the problem, 
#     but i will not be sending you the entire code done till time again and again, 
#     just the edited part. each time i send these snippets, your job is to provide guidance, 
#     and tell me if i am going in the right direction or not. 
#     if i am, no need to say anything, but if not, just give me a nudge maybe, 
#     or just tell me how this decision could impact solving the code. i also want you 
#     to extract key ideas thought by me, my thinking process, where i went wrong, and 
#     what i need to keep in mind - put this extraction in a separate section of your 
#     response called thoughts to remember - and let it not be big explanations. the goal
#     is for me when i look at this, to remember immediately. can you do this? and when giving 
#     nudges, dont dwell too deep with long answers, just short, even 1 line and precise nudges wil 
#     be good. dont ask me to think whats next, the skeleton looks fine right? so say nothing. if there 
#     is no problem, say nothing.
#     code: {fullCode}, focus block: {focusBlock}
#     """
#     try:
#         response = client.chat.completions.create(
#             model="gpt-3.5-turbo",
#             messages=[{"role": "user", "content": prompt}],
#         )

#         content = response.choices[0].message.content
#         #print("this is the response: ", response)
#         return content.strip() if content else ""

#     except Exception as e:
#         print("Error:", e)
#         time.sleep(60)
#         return str(e)