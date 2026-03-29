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


ACTIVITY_MULTIPLIERS = {
    "sedentary": 1.2,       # Desk job, mostly sitting
    "light": 1.375,         # Some walking, light chores
    "moderate": 1.55,       # On your feet at work
    "active": 1.725,        # Physical job, lots of walking
    "very_active": 1.9,     # Heavy physical labor
}


class UserProfile(BaseModel):
    name: str
    gender: str = ""              # "male" or "female"
    age: int = 0
    weight_kg: float = 0          # kilograms
    height_cm: float = 0          # centimeters
    activity: str = "light"       # sedentary, light, moderate, active, very_active
    daily_burn: int = 2200        # auto-calculated if profile is complete
    pin: str = ""


def calculate_daily_burn(profile: dict) -> int:
    """
    Mifflin-St Jeor equation × activity multiplier.
    Returns calculated TDEE, or the manual daily_burn if profile is incomplete.
    """
    gender = profile.get("gender", "")
    age = profile.get("age", 0)
    weight = profile.get("weight_kg", 0)
    height = profile.get("height_cm", 0)
    activity = profile.get("activity", "light")

    if not all([gender, age, weight, height]):
        return profile.get("daily_burn", 2200)

    # BMR
    bmr = 10 * weight + 6.25 * height - 5 * age
    if gender == "male":
        bmr += 5
    else:
        bmr -= 161

    # TDEE = BMR × activity multiplier
    multiplier = ACTIVITY_MULTIPLIERS.get(activity, 1.375)
    tdee = bmr * multiplier
    return round(tdee)
