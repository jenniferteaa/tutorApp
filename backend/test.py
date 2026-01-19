from pydantic import BaseModel
import json

class Topics(BaseModel):
    topic: dict[str, list[str]]

topic = {
    "two_pointers": [
        "Two pointers work well when the input is sorted.",
        "Pointer movement must preserve the loop invariant."
    ],
    "string": [
        "String concatenation in a loop can cause O(n²) time complexity."
    ],
    "binary_tree": []
}


def testfunction():
    t = json.dumps(topic, indent=2)
    print(t)

testfunction()
