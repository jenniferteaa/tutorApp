import os
import json
import redis
from typing import Any, cast

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
r = redis.Redis.from_url(REDIS_URL, decode_responses=True)

def rkey(prefix: str, user_id: str, session_id: str) -> str:
    return f"{prefix}:{user_id}:{session_id}"

def set_json(key: str, obj: Any, ex: int) -> None:
    r.set(key, json.dumps(obj), ex=ex)

def get_json(key: str) -> Any | None:
    val = r.get(key)
    if val is None:
        return None
    return json.loads(cast(str, val))
