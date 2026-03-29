"""
Calorie Counter API

Run with:  uvicorn main:app --reload
Docs at:   http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.entries import router as entries_router
from routes.users import router as users_router

app = FastAPI(title="Calorie Counter API", version="0.1.0")

# Allow the frontend (GitHub Pages) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this once you have a domain
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(entries_router)
app.include_router(users_router)


@app.get("/")
def health():
    return {"status": "ok", "app": "calorie-counter"}
