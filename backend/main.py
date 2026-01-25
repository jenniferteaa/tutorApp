from fastapi import FastAPI
from pydantic import BaseModel
from services.llmRequests import requestingCodeCheck, answerAskanything, guideModeAssist, requestSummarization
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

class AskPayload(BaseModel):
    sessionId: str
    action: str
    rollingHistory: list[str]
    summary: str
    query: str

class CodeToSummarize(BaseModel):
    sessionID: str
    summarize: list[str]
    summary: str

@app.post("/api/llm")
def llm(req: CodeRequest):
    match req.action:
        case "check-code":
            response = requestingCodeCheck(req.topics, req.code)
            return {"success": True, "reply": response}
        case _:
            return {"success": False, "error": "Unknown request type"}
        
@app.post("/api/llm/summarize")
def llmSummarize(req: CodeToSummarize):
    response = requestSummarization(req.summary, req.summarize)
    return {"success": True, "reply": response}
        
@app.post("/api/llm/ask")
def llmAsk(req: AskPayload):
    match req.action:
        case "ask-anything":
            response = answerAskanything(req.rollingHistory, req.summary, req.query) # add rollinghistory
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
