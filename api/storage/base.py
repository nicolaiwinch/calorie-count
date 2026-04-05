"""
Storage abstraction layer.

All storage backends implement this interface. The rest of the app
talks only to these methods — never directly to files or databases.
Swap the backend by changing one line in config.
"""

from abc import ABC, abstractmethod
from datetime import date


class StorageBackend(ABC):

    @abstractmethod
    def get_entries(self, user_id: str, day: date) -> list[dict]:
        """Get all entries for a user on a given date."""

    @abstractmethod
    def add_entry(self, user_id: str, entry: dict) -> dict:
        """Add an entry. Returns the entry with an assigned ID."""

    @abstractmethod
    def delete_entry(self, user_id: str, day: date, entry_id: str) -> bool:
        """Delete an entry by ID. Returns True if found and deleted."""

    @abstractmethod
    def get_user(self, user_id: str) -> dict | None:
        """Get user profile. Returns None if not found."""

    @abstractmethod
    def save_user(self, user_id: str, profile: dict) -> dict:
        """Create or update a user profile."""

    @abstractmethod
    def list_users(self) -> list[dict]:
        """List all user profiles."""

    @abstractmethod
    def list_entry_dates(self, user_id: str) -> list[str]:
        """List all dates (YYYY-MM-DD) that have entries for a user, newest first."""

    @abstractmethod
    def get_entries_range(self, user_id: str, start: date, end: date) -> list[dict]:
        """Get all entries for a user between start and end dates (inclusive)."""

    @abstractmethod
    def get_confirmed_days(self, user_id: str) -> list[str]:
        """Get list of dates confirmed as OK by the user."""

    @abstractmethod
    def confirm_day(self, user_id: str, day: date) -> bool:
        """Mark a day as confirmed OK. Returns True."""

    @abstractmethod
    def unconfirm_day(self, user_id: str, day: date) -> bool:
        """Remove confirmed status from a day. Returns True."""

    @abstractmethod
    def update_entry(self, user_id: str, day: date, entry_id: str, updates: dict) -> dict | None:
        """Partially update an entry. Returns updated entry or None if not found."""

    @abstractmethod
    def get_weight_entries(self, user_id: str) -> list[dict]:
        """Get all weight entries for a user, sorted by date."""

    @abstractmethod
    def save_weight_entry(self, user_id: str, entry: dict) -> dict:
        """Save a weight entry (date + kg). Overwrites if same date exists."""

    @abstractmethod
    def delete_weight_entry(self, user_id: str, day: str) -> bool:
        """Delete a weight entry by date. Returns True if found and deleted."""
