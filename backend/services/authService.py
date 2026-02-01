import os
import time
import secrets
import json
import base64
import hashlib
import requests
try:
    import redis  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    redis = None
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
BACKEND_TOKEN_TTL_SECONDS = int(os.getenv("BACKEND_TOKEN_TTL_SECONDS", "1800"))
REDIS_URL = os.getenv("REDIS_URL", "")

_sessions: dict[str, tuple[str, float]] = {}
_bridge_codes: dict[str, tuple[str, float]] = {}

BRIDGE_CODE_TTL_SECONDS = int(os.getenv("BRIDGE_CODE_TTL_SECONDS", "120"))
BRIDGE_RATE_LIMIT_IP = int(os.getenv("BRIDGE_RATE_LIMIT_IP", "30"))
BRIDGE_RATE_LIMIT_USER = int(os.getenv("BRIDGE_RATE_LIMIT_USER", "20"))
BRIDGE_RATE_LIMIT_WINDOW_SECONDS = int(
    os.getenv("BRIDGE_RATE_LIMIT_WINDOW_SECONDS", "60")
)

_redis_client = None
_rate_limits: dict[str, tuple[int, float]] = {}


def _get_redis_client():
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    if not REDIS_URL or redis is None:
        _redis_client = None
        return None
    try:
        _redis_client = redis.Redis.from_url(REDIS_URL, decode_responses=True)
    except Exception:
        _redis_client = None
    return _redis_client


def _hash_value(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()


def _decode_jwt_sub(token: str) -> str | None:
    if not token or "." not in token:
        return None
    parts = token.split(".")
    if len(parts) < 2:
        return None
    payload = parts[1]
    padding = "=" * (-len(payload) % 4)
    try:
        decoded = base64.urlsafe_b64decode(payload + padding).decode("utf-8")
        data = json.loads(decoded)
    except Exception:
        return None
    sub = data.get("sub")
    return sub if isinstance(sub, str) else None


def _rate_limit_key(prefix: str, value: str) -> str:
    return f"bridge_rl:{prefix}:{value}"


def _rate_limit_ok(key: str, limit: int, window_seconds: int) -> bool:
    if limit <= 0:
        return True
    client = _get_redis_client()
    if client:
        try:
            count = client.incr(key)
            if count == 1:
                client.expire(key, window_seconds)
            return count <= limit
        except Exception:
            pass
    now = time.time()
    count, reset_at = _rate_limits.get(key, (0, now + window_seconds))
    if now > reset_at:
        count = 0
        reset_at = now + window_seconds
    count += 1
    _rate_limits[key] = (count, reset_at)
    return count <= limit


def check_bridge_rate_limits(ip: str | None, user_id: str | None) -> bool:
    if ip:
        key = _rate_limit_key("ip", ip)
        if not _rate_limit_ok(key, BRIDGE_RATE_LIMIT_IP, BRIDGE_RATE_LIMIT_WINDOW_SECONDS):
            return False
    if user_id:
        key = _rate_limit_key("user", user_id)
        if not _rate_limit_ok(key, BRIDGE_RATE_LIMIT_USER, BRIDGE_RATE_LIMIT_WINDOW_SECONDS):
            return False
    return True


def _issue_backend_token(user_id: str, access_token: str | None = None) -> dict | None:
    if not user_id:
        return None
    token = secrets.token_urlsafe(32)
    _sessions[token] = (user_id, time.time() + BACKEND_TOKEN_TTL_SECONDS)
    result = {"token": token, "userId": user_id}
    if access_token:
        result["accessToken"] = access_token
    return result


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
    access_token = data.get("access_token")
    return _issue_backend_token(user_id, access_token)


def signup_with_supabase(
    email: str,
    password: str,
    first_name: str,
    last_name: str,
) -> dict | None:
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        return None
    response = requests.post(
        f"{SUPABASE_URL}/auth/v1/signup",
        headers={
            "Content-Type": "application/json",
            "apikey": SUPABASE_ANON_KEY,
        },
        json={
            "email": email,
            "password": password,
            "data": {"first_name": first_name, "last_name": last_name},
        },
        timeout=10,
    )
    if not response.ok:
        return None
    data = response.json()
    user = data.get("user") if isinstance(data, dict) else None
    user_id = (
        (user or {}).get("id")
        or data.get("id")
        or data.get("user_id")
    )
    if not user_id:
        return None

    email_confirmed_at = (
        (user or {}).get("email_confirmed_at")
        or (user or {}).get("confirmed_at")
        or data.get("email_confirmed_at")
        or data.get("confirmed_at")
    )

    if not SUPABASE_SERVICE_ROLE_KEY:
        return None
    details_resp = requests.post(
        f"{SUPABASE_URL}/rest/v1/user_details",
        headers={
            "Content-Type": "application/json",
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Prefer": "return=representation",
        },
        json={
            "user_id": user_id,
            "uname": first_name,
            "lname": last_name,
            "email": email,
        },
        timeout=10,
    )
    if not details_resp.ok:
        return None

    if not email_confirmed_at:
        return {"requiresVerification": True, "userId": user_id}

    access_token = data.get("access_token")
    return _issue_backend_token(user_id, access_token)


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


def create_bridge_code(access_token: str, state: str) -> str | None:
    if not access_token or not state:
        return None
    code = secrets.token_urlsafe(24)
    client = _get_redis_client()
    state_hash = _hash_value(state)
    user_id = _decode_jwt_sub(access_token)
    if client:
        try:
            payload = json.dumps(
                {
                    "access_token": access_token,
                    "state_hash": state_hash,
                    "user_id": user_id,
                    "expires_at": time.time() + BRIDGE_CODE_TTL_SECONDS,
                }
            )
            client.setex(
                f"bridge_code:{_hash_value(code)}",
                BRIDGE_CODE_TTL_SECONDS,
                payload,
            )
            return code
        except Exception:
            pass
    _bridge_codes[_hash_value(code)] = (
        json.dumps(
            {
                "access_token": access_token,
                "state_hash": state_hash,
                "user_id": user_id,
                "expires_at": time.time() + BRIDGE_CODE_TTL_SECONDS,
            }
        ),
        time.time() + BRIDGE_CODE_TTL_SECONDS,
    )
    return code


def consume_bridge_code(code: str, state: str) -> tuple[str | None, str | None]:
    if not code or not state:
        return None, None
    code_hash = _hash_value(code)
    state_hash = _hash_value(state)
    client = _get_redis_client()
    if client:
        try:
            key = f"bridge_code:{code_hash}"
            pipe = client.pipeline()
            pipe.get(key)
            pipe.delete(key)
            value, _ = pipe.execute()
            if not value:
                return None, None
            payload = json.loads(value)
            if payload.get("state_hash") != state_hash:
                return None, None
            return payload.get("access_token"), payload.get("user_id")
        except Exception:
            pass
    entry = _bridge_codes.pop(code_hash, None)
    if not entry:
        return None, None
    payload_str, expires_at = entry
    if time.time() > expires_at:
        return None, None
    try:
        payload = json.loads(payload_str)
    except Exception:
        return None, None
    if payload.get("state_hash") != state_hash:
        return None, None
    return payload.get("access_token"), payload.get("user_id")
