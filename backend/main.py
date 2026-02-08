from fastapi import FastAPI, Header, Request
from pydantic import BaseModel
from services.llmRequests import (
    requestingCodeCheck,
    answerAskanything,
    guideModeAssist,
    requestSummarization,
    guide_mode_enable,
    guide_mode_disable,
    summarize_topic_notes,
)
from models import RollingStateGuideMode, TopicNotes
from services.authService import (
    login_with_supabase,
    signup_with_supabase,
    verify_backend_token,
    create_bridge_code,
    consume_bridge_code,
    check_bridge_rate_limits,
    prepare_bridge_access_token,
)
from services.sessionState import init_session_state

app = FastAPI()

class CodeRequest(BaseModel):
    sessionId: str
    topics: dict[str, TopicNotes]
    code: str
    action: str
    language: str = ""
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
    language: str = ""
    rollingStateGuideMode: RollingStateGuideMode

class GuideModeStatusRequest(BaseModel):
    sessionId: str
    problem_no: int | None = None #change - check this to see if can make it mandatory
    problem_name: str
    problem_url: str

class SessionInitPayload(BaseModel):
    sessionId: str
    topics: dict[str, TopicNotes]

class AskPayload(BaseModel):
    sessionId: str
    action: str
    rollingHistory: list[str]
    summary: str
    query: str
    language: str = ""

class CodeToSummarize(BaseModel):
    sessionID: str
    summarize: list[str]
    summary: str

class TopicSummaryPayload(BaseModel):
    notes: list[str] #must contain the summary notes and t maybe it does
    pitfalls: list[str]

class LoginPayload(BaseModel):
    email: str
    password: str

class SignupPayload(BaseModel):
    fname: str
    lname: str
    email: str
    password: str

class BridgeStartPayload(BaseModel):
    access_token: str
    refresh_token: str | None = None
    state: str

class BridgeConsumePayload(BaseModel):
    code: str
    state: str

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
                req.language,
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
def llmSummarize(req: CodeToSummarize, authorization: str | None = Header(default=None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
    user_id = verify_backend_token(token)
    if not user_id:
        return {"success": False, "error": "Unauthorized"}
    response = requestSummarization(req.summary, req.summarize)
    return {"success": True, "reply": response}

@app.post("/api/llm/topic-summary")
def llmTopicSummary(req: TopicSummaryPayload):
    response = summarize_topic_notes(req.notes, req.pitfalls)
    return {"success": True, **response}
        
@app.post("/api/llm/ask")
def llmAsk(req: AskPayload, authorization: str | None = Header(default=None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
    user_id = verify_backend_token(token)
    if not user_id:
        return {"success": False, "error": "Unauthorized"}
    match req.action:
        case "ask-anything":
            response = answerAskanything(
                req.rollingHistory,
                req.summary,
                req.query,
                req.language,
            ) # add rollinghistory
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
                req.problem,
                req.topics,
                req.code,
                req.focusLine,
                req.language,
                req.rollingStateGuideMode,
                req.sessionId,
                user_id,
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

@app.post("/api/session/init")
def session_init(req: SessionInitPayload, authorization: str | None = Header(default=None)):
    token = None
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ", 1)[1].strip()
    user_id = verify_backend_token(token)
    if not user_id:
        return {"success": False, "error": "Unauthorized"}
    init_session_state(user_id, req.sessionId, req.topics)
    return {"success": True}

@app.post("/api/auth/login")
def auth_login(req: LoginPayload):
    result = login_with_supabase(req.email, req.password)
    if not result:
        return {"success": False, "error": "Invalidd credentials"}
    return {"success": True, **result}

@app.post("/api/auth/signup")
def auth_signup(req: SignupPayload):
    result = signup_with_supabase(req.email, req.password, req.fname, req.lname)
    if not result:
        return {"success": False, "error": "Signup failed"}
    return {"success": True, **result}

@app.post("/api/auth/bridge/start")
def auth_bridge_start(req: BridgeStartPayload, request: Request):
    ip = request.headers.get("x-forwarded-for") or (request.client.host if request.client else None)
    user_id = None
    if not check_bridge_rate_limits(ip, user_id):
        return {"success": False, "error": "Rate limit exceeded"}
    access_token, refresh_token, refreshed = prepare_bridge_access_token(
        req.access_token,
        req.refresh_token,
    )
    if not access_token:
        return {"success": False, "error": "Access token expired"}
    code = create_bridge_code(access_token, req.state, refresh_token)
    if not code:
        return {"success": False, "error": "Bridge start failed"}
    response = {"success": True, "code": code}
    if refreshed:
        response["access_token"] = access_token
        if refresh_token:
            response["refresh_token"] = refresh_token
    return response

@app.post("/api/auth/bridge/consume")
def auth_bridge_consume(req: BridgeConsumePayload, request: Request):
    ip = request.headers.get("x-forwarded-for") or (request.client.host if request.client else None)
    token, refresh_token, user_id = consume_bridge_code(req.code, req.state)
    if not token:
        return {"success": False, "error": "Bridge code invalid or expired"}
    if not check_bridge_rate_limits(ip, user_id):
        return {"success": False, "error": "Rate limit exceeded"}
    response = {"success": True, "access_token": token}
    if refresh_token:
        response["refresh_token"] = refresh_token
    return response
