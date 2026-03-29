"""
App configuration.

Change STORAGE_BACKEND to swap storage implementations.
Everything else reads from here.
"""

from storage import JsonStorage

# --- Storage ---
# Swap this line to change backend:
#   from storage import SqliteStorage
#   STORAGE = SqliteStorage("calories.db")
STORAGE = JsonStorage(data_dir="data")

# --- Calorie defaults ---
DEFAULT_DAILY_BURN = 2200
GREEN_THRESHOLD = 600
