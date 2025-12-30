from fastapi import FastAPI
from pydantic import BaseModel
from services.llmRequests import requestingCodeCheck

app = FastAPI()

class CodeRequest(BaseModel):
    code: str
    action: str

@app.post("/api/llm")
def llm(req: CodeRequest):
    print("this is the request in teh backend: ", req)
    match req.action:
        case "check-code":
            response = requestingCodeCheck(req.code)
            return {"success": True, "reply": response}
        case _:
            return {"success": False, "error": "Unknown request type"}
