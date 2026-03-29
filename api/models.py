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
    gender: str = ""         # "male" or "female"
    age: int = 0
    weight_kg: float = 0     # kilograms
    height_cm: float = 0     # centimeters
    daily_burn: int = 2200   # auto-calculated if profile is complete
    pin: str = ""


def calculate_daily_burn(profile: dict) -> int:
    """
    Mifflin-St Jeor equation × 1.2 sedentary multiplier.
    Returns calculated TDEE, or the manual daily_burn if profile is incomplete.
    """
    gender = profile.get("gender", "")
    age = profile.get("age", 0)
    weight = profile.get("weight_kg", 0)
    height = profile.get("height_cm", 0)

    if not all([gender, age, weight, height]):
        return profile.get("daily_burn", 2200)

    # BMR
    bmr = 10 * weight + 6.25 * height - 5 * age
    if gender == "male":
        bmr += 5
    else:
        bmr -= 161

    # TDEE = BMR × sedentary multiplier
    tdee = bmr * 1.2
    return round(tdee)
