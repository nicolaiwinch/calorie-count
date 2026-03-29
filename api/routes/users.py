from fastapi import APIRouter, HTTPException

from config import STORAGE
from models import UserProfile, calculate_daily_burn

router = APIRouter(prefix="/api/users", tags=["users"])


@router.get("/")
def list_users() -> list[dict]:
    return STORAGE.list_users()


@router.get("/{user_id}")
def get_user(user_id: str) -> dict:
    user = STORAGE.get_user(user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"id": user_id, **user}


@router.put("/{user_id}")
def save_user(user_id: str, profile: UserProfile) -> dict:
    data = profile.model_dump()
    data["daily_burn"] = calculate_daily_burn(data)
    saved = STORAGE.save_user(user_id, data)
    return {"id": user_id, **saved}
