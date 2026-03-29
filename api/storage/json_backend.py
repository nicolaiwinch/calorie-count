"""
JSON file storage backend.

Data layout:
  data/
    users.json              — all user profiles
    entries/
      {user_id}/
        2026-03-29.json     — entries for that day
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
