from datetime import date

from fastapi import APIRouter, HTTPException

from config import STORAGE
from models import EntryIn, EntryOut

router = APIRouter(prefix="/api/entries", tags=["entries"])


@router.get("/{user_id}/{day}")
def get_entries(user_id: str, day: date) -> list[EntryOut]:
    return STORAGE.get_entries(user_id, day)


@router.post("/{user_id}")
def add_entry(user_id: str, entry: EntryIn) -> EntryOut:
    if STORAGE.get_user(user_id) is None:
        raise HTTPException(status_code=404, detail="User not found")
    saved = STORAGE.add_entry(user_id, entry.model_dump())
    return saved


@router.delete("/{user_id}/{day}/{entry_id}")
def delete_entry(user_id: str, day: date, entry_id: str) -> dict:
    deleted = STORAGE.delete_entry(user_id, day, entry_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"deleted": True}
