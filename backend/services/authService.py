import os
import time
import secrets
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
BACKEND_TOKEN_TTL_SECONDS = int(os.getenv("BACKEND_TOKEN_TTL_SECONDS", "1800"))

_sessions: dict[str, tuple[str, float]] = {}


def login_with_supabase(email: str, password: str) -> dict | None:
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return None
    response = requests.post(
        f"{SUPABASE_URL}/auth/v1/token?grant_type=password",
        headers={
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY,
        },
        json={"email": email, "password": password},
        timeout=10,
    )
    if not response.ok:
        return None
    data = response.json()
    user_id = data.get("user", {}).get("id")
    if not user_id:
        return None
    token = secrets.token_urlsafe(32)
    _sessions[token] = (user_id, time.time() + BACKEND_TOKEN_TTL_SECONDS)
    return {"token": token, "userId": user_id}


def verify_backend_token(token: str | None) -> str | None:
    if not token:
        return None
    entry = _sessions.get(token)
    if not entry:
        return None
    user_id, expires_at = entry
    if time.time() > expires_at:
        _sessions.pop(token, None)
        return None
    return user_id
