from fastapi import FastAPI
from pydantic import BaseModel
from services.llmRequests import requestingCodeCheck, answerAskanything, guideModeAssist

app = FastAPI()

class CodeRequest(BaseModel):
    code: str
    action: str

class GuideModeRequest(BaseModel):
    action: str
    code: str
    focusLine: str

@app.post("/api/llm")
def llm(req: CodeRequest):
    print("this is the request in teh backend: ", req)
    match req.action:
        case "check-code":
            response = requestingCodeCheck(req.code)
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
            response = guideModeAssist(req.code, req.focusLine)
            return {"success": True, "reply": response}
