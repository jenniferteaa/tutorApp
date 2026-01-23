from fastapi import FastAPI
from pydantic import BaseModel
from services.llmRequests import requestingCodeCheck, answerAskanything, guideModeAssist
from models import RollingStateGuideMode, TopicNotes

app = FastAPI()

class CodeRequest(BaseModel):
    sessionId: str
    topics: dict[str, TopicNotes]
    code: str
    action: str

class GuideModeRequest(BaseModel):
    sessionId: str
    action: str
    problem: str
    topics: dict[str, TopicNotes]
    code: str
    focusLine: str
    rollingStateGuideMode: RollingStateGuideMode


@app.post("/api/llm")
def llm(req: CodeRequest):
    #print("this is the request in teh backend: ", req)
    match req.action:
        case "check-code":
            response = requestingCodeCheck(req.topics, req.code)
            return {"success": True, "reply": response}
        case "ask-anything":
            response = answerAskanything(req.code)
            return {"success": True, "reply": response}
        case _:
            return {"success": False, "error": "Unknown request type"}
        
@app.post("/api/llm/guide")
def llmGuideMode(req: GuideModeRequest):
    match(req.action):
        case "guide-mode":
            response = guideModeAssist(
                req.problem, req.topics, req.code, req.focusLine, req.rollingStateGuideMode
            )
            return {"success": True, "reply": response}
        case _:
            return {"success": False, "error": "Unknown guide mode action"}
