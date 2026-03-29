"""
Pydantic models — define the shape of data going in and out of the API.
"""

from pydantic import BaseModel


class EntryIn(BaseModel):
    type: str          # "food" or "exercise"
    name: str
    cal: int
    time: str          # ISO timestamp, e.g. "2026-03-29T14:30:00"


class EntryOut(EntryIn):
    id: str


class UserProfile(BaseModel):
    name: str
    daily_burn: int = 2200
    pin: str = ""      # simple pin, not real auth
