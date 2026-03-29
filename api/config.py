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
import os

# Use /data (persistent volume) on Railway, local "data" dir for development
DATA_DIR = os.environ.get("DATA_DIR", "data")
STORAGE = JsonStorage(data_dir=DATA_DIR)

# --- Calorie defaults ---
DEFAULT_DAILY_BURN = 2200
GREEN_THRESHOLD = 600
