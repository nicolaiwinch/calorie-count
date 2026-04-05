"""
JSON file storage backend.

Data layout:
  data/
    users.json              — all user profiles
    entries/
      {user_id}/
        2026-03-29.json     — entries for that day
        confirmed.json      — list of dates marked as OK
"""

import json
import uuid
from datetime import date
from pathlib import Path

from .base import StorageBackend


class JsonStorage(StorageBackend):

    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.entries_dir = self.data_dir / "entries"
        self.entries_dir.mkdir(exist_ok=True)
        self.users_file = self.data_dir / "users.json"

    def _user_dir(self, user_id: str) -> Path:
        path = self.entries_dir / user_id
        path.mkdir(parents=True, exist_ok=True)
        return path

    def _day_file(self, user_id: str, day: date) -> Path:
        return self._user_dir(user_id) / f"{day.isoformat()}.json"

    def _read_json(self, path: Path) -> list | dict:
        if not path.exists():
            return [] if path.name != "users.json" else {}
        with open(path, "r") as f:
            return json.load(f)

    def _write_json(self, path: Path, data: list | dict) -> None:
        with open(path, "w") as f:
            json.dump(data, f, indent=2, default=str)

    # --- Entries ---

    def get_entries(self, user_id: str, day: date) -> list[dict]:
        return self._read_json(self._day_file(user_id, day))

    def add_entry(self, user_id: str, entry: dict) -> dict:
        day = date.fromisoformat(entry["time"][:10])
        file = self._day_file(user_id, day)
        entries = self._read_json(file)

        entry["id"] = str(uuid.uuid4())[:8]
        entries.append(entry)
        self._write_json(file, entries)

        return entry

    def delete_entry(self, user_id: str, day: date, entry_id: str) -> bool:
        file = self._day_file(user_id, day)
        entries = self._read_json(file)

        filtered = [e for e in entries if e.get("id") != entry_id]
        if len(filtered) == len(entries):
            return False

        self._write_json(file, filtered)
        return True

    # --- Users ---

    def get_user(self, user_id: str) -> dict | None:
        users = self._read_json(self.users_file)
        return users.get(user_id)

    def save_user(self, user_id: str, profile: dict) -> dict:
        users = self._read_json(self.users_file)
        users[user_id] = profile
        self._write_json(self.users_file, users)
        return profile

    def list_users(self) -> list[dict]:
        users = self._read_json(self.users_file)
        return [{"id": k, **v} for k, v in users.items()]

    def list_entry_dates(self, user_id: str) -> list[str]:
        user_dir = self.entries_dir / user_id
        if not user_dir.exists():
            return []
        dates = []
        for f in user_dir.glob("*.json"):
            if f.stem == "confirmed":
                continue
            entries = self._read_json(f)
            if entries:
                dates.append(f.stem)
        dates.sort(reverse=True)
        return dates

    def get_entries_range(self, user_id: str, start: date, end: date) -> list[dict]:
        user_dir = self.entries_dir / user_id
        if not user_dir.exists():
            return []
        all_entries = []
        for f in user_dir.glob("*.json"):
            if f.stem == "confirmed":
                continue
            try:
                file_date = date.fromisoformat(f.stem)
            except ValueError:
                continue
            if start <= file_date <= end:
                day_entries = self._read_json(f)
                all_entries.extend(day_entries)
        all_entries.sort(key=lambda e: e.get("time", ""), reverse=True)
        return all_entries

    def _confirmed_file(self, user_id: str) -> Path:
        return self._user_dir(user_id) / "confirmed.json"

    def get_confirmed_days(self, user_id: str) -> list[str]:
        data = self._read_json(self._confirmed_file(user_id))
        return data if isinstance(data, list) else []

    def confirm_day(self, user_id: str, day: date) -> bool:
        path = self._confirmed_file(user_id)
        days = self.get_confirmed_days(user_id)
        day_str = day.isoformat()
        if day_str not in days:
            days.append(day_str)
            self._write_json(path, days)
        return True

    def unconfirm_day(self, user_id: str, day: date) -> bool:
        path = self._confirmed_file(user_id)
        days = self.get_confirmed_days(user_id)
        day_str = day.isoformat()
        if day_str in days:
            days.remove(day_str)
            self._write_json(path, days)
        return True

    def update_entry(self, user_id: str, day: date, entry_id: str, updates: dict) -> dict | None:
        file = self._day_file(user_id, day)
        entries = self._read_json(file)
        for entry in entries:
            if entry.get("id") == entry_id:
                entry.update(updates)
                self._write_json(file, entries)
                return entry
        return None
