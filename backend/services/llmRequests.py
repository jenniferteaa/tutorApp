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
