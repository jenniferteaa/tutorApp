from fastapi import FastAPI, Header
from pydantic import BaseModel
from services.llmRequests import requestingCodeCheck, answerAskanything, guideModeAssist, requestSummarization, guide_mode_enable, guide_mode_disable
from models import RollingStateGuideMode, TopicNotes
from services.authService import login_with_supabase, verify_backend_token

app = FastAPI()

class CodeRequest(BaseModel):
    sessionId: str
    topics: dict[str, TopicNotes]
    code: str
    action: str
    problem_no: int | None = None
    problem_name: str = ""
    problem_url: str = ""

class GuideModeRequest(BaseModel):
    sessionId: str
    action: str
    problem: str
    topics: dict[str, TopicNotes]
    code: str
    focusLine: str
    rollingStateGuideMode: RollingStateGuideMode

class GuideModeStatusRequest(BaseModel):
    sessionId: str
    problem_no: int | None = None #change - check this to see if can make it mandatory
    problem_name: str
    problem_url: str

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

class LoginPayload(BaseModel):
    email: str
    password: str

@app.post("/api/llm")
def llm(req: CodeRequest, authorization: str | None = Header(default=None)):
    match req.action:
        case "check-code":
            token = None
            if authorization and authorization.startswith("Bearer "):
                token = authorization.split(" ", 1)[1].strip()
            user_id = verify_backend_token(token)
            if not user_id:
                return {"success": False, "error": "Unauthorized"}
            response = requestingCodeCheck(
                req.topics,
                req.code,
                req.sessionId,
                user_id,
                req.problem_no,
                req.problem_name,
                req.problem_url,
            )
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
def llmGuideMode(req: GuideModeRequest, authorization: str | None = Header(default=None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
    user_id = verify_backend_token(token)
    if not user_id:
        return {"success": False, "error": "Unauthorized"}
    match(req.action):
        case "guide-mode":
            response = guideModeAssist(
                req.problem, req.topics, req.code, req.focusLine, req.rollingStateGuideMode, req.sessionId, user_id
            )
            return {"success": True, "reply": response}
        case _:
            return {"success": False, "error": "Unknown guide mode action"}

@app.post("/api/guide/enable")
def guide_enable(req: GuideModeStatusRequest, authorization: str | None = Header(default=None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
    user_id = verify_backend_token(token)
    if not user_id:
        return {"success": False, "error": "Unauthorized"}
    guide_mode_enable(req.sessionId, user_id, req.problem_no, req.problem_name, req.problem_url)
    return {"success": True}

@app.post("/api/guide/disable")
def guide_disable(req: GuideModeStatusRequest, authorization: str | None = Header(default=None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
    user_id = verify_backend_token(token)
    if not user_id:
        return {"success": False, "error": "Unauthorized"}
    guide_mode_disable(req.sessionId, user_id, req.problem_no, req.problem_name, req.problem_url)
    return {"success": True}

@app.post("/api/auth/login")
def auth_login(req: LoginPayload):
    result = login_with_supabase(req.email, req.password)
    if not result:
        return {"success": False, "error": "Invalidd credentials"}
    return {"success": True, **result}
