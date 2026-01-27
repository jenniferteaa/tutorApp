import os
from datetime import datetime, timezone
from dotenv import load_dotenv
import requests

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
SUPABASE_TABLE = os.getenv("SUPABASE_TABLE", "vibetutor_writes")


def write_checkmode_result(
    user_id: str | None,
    session_id: str,
    topics: dict,
    response_text: str,
) -> None:
    if not user_id or not response_text:
        return
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
        return
    payload = {
        "user_id": user_id,
        "session_id": session_id,
        "topics": topics,
        "response": response_text,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    requests.post(
        f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}",
        headers={
            "Content-Type": "application/json",
            "apikey": SUPABASE_SERVICE_ROLE_KEY,
            "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
            "Prefer": "return=minimal",
        },
        json=payload,
        timeout=10,
    )
