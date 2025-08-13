# main.py
from fastapi import FastAPI
from app import models
from app.database import engine
from app.routers import chat
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Create tables if not using migrations
models.Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include chat API routes
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
