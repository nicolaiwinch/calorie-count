from datetime import date

from fastapi import APIRouter, HTTPException

from config import STORAGE
from models import EntryIn, EntryOut

router = APIRouter(prefix="/api/entries", tags=["entries"])


@router.get("/{user_id}/dates")
def list_dates(user_id: str) -> list[str]:
    return STORAGE.list_entry_dates(user_id)


@router.get("/{user_id}/range/{start}/{end}")
def get_entries_range(user_id: str, start: date, end: date) -> list[EntryOut]:
    return STORAGE.get_entries_range(user_id, start, end)


@router.get("/{user_id}/confirmed")
def get_confirmed(user_id: str) -> list[str]:
    return STORAGE.get_confirmed_days(user_id)


@router.post("/{user_id}/confirm/{day}")
def confirm_day(user_id: str, day: date) -> dict:
    STORAGE.confirm_day(user_id, day)
    return {"confirmed": True}


@router.delete("/{user_id}/confirm/{day}")
def unconfirm_day(user_id: str, day: date) -> dict:
    STORAGE.unconfirm_day(user_id, day)
    return {"unconfirmed": True}


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
