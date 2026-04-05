from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from config import STORAGE

router = APIRouter(prefix="/api/weight", tags=["weight"])


class WeightIn(BaseModel):
    date: str   # YYYY-MM-DD
    kg: float


@router.get("/{user_id}")
def get_weight(user_id: str) -> list[dict]:
    return STORAGE.get_weight_entries(user_id)


@router.post("/{user_id}")
def add_weight(user_id: str, entry: WeightIn) -> dict:
    if STORAGE.get_user(user_id) is None:
        raise HTTPException(status_code=404, detail="User not found")
    return STORAGE.save_weight_entry(user_id, entry.model_dump())


@router.delete("/{user_id}/{day}")
def delete_weight(user_id: str, day: str) -> dict:
    deleted = STORAGE.delete_weight_entry(user_id, day)
    if not deleted:
        raise HTTPException(status_code=404, detail="Weight entry not found")
    return {"deleted": True}
