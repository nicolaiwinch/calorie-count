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
