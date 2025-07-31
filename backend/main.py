from fastapi import FastAPI
from app import models
from app.database import engine
from app.routers import chat
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Create all tables
models.Base.metadata.create_all(bind=engine)

# Include chat API routes

