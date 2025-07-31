from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, crud
from datetime import datetime
from app.utils.llm import generate_ai_response
from typing import List

router = APIRouter(prefix="/chat", tags=["Chat"])

# --- USERS ---
@router.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user)

@router.get("/users/{user_id}", response_model=schemas.UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# --- CHAT SESSIONS ---
@router.post("/sessions/", response_model=schemas.ChatSessionOut)
def create_session(session: schemas.ChatSessionCreate, db: Session = Depends(get_db)):
    return crud.create_chat_session(db, session)

@router.get("/sessions/{session_id}", response_model=schemas.ChatSessionOut)
def read_session(session_id: int, db: Session = Depends(get_db)):
    session = crud.get_chat_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.get("/sessions", response_model=List[schemas.ChatSessionSimple])
def get_sessions(db: Session = Depends(get_db)):
    return db.query(models.ChatSession).all()

@router.get("/sessions", response_model=List[schemas.ChatSessionOut])
def list_chat_sessions(db: Session = Depends(get_db)):
    sessions = crud.get_all_chat_sessions(db)
    return sessions


# --- MESSAGES ---
@router.post("/messages/", response_model=schemas.MessageOut)
def post_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    return crud.add_message(db, message)

@router.get("/sessions/{session_id}/messages", response_model=List[schemas.MessageOut])
def get_messages(session_id: int, db: Session = Depends(get_db)):
    return crud.get_messages_by_session(db, session_id)

# --- CHAT INTERACTION ENDPOINT ---
@router.post("/", response_model=schemas.ChatResponse)
def chat(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    # Validate user
    user = crud.get_user(db, request.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get or create session
    if request.session_id:
        session = crud.get_chat_session(db, request.session_id)
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = crud.create_chat_session(
            db, schemas.ChatSessionCreate(user_id=request.user_id)
        )

    # Store user message
    crud.add_message(
        db,
        schemas.MessageCreate(
            session_id=session.id,
            sender="user",
            content=request.message
        )
    )

    # Generate AI reply
    ai_reply = generate_ai_response(request.message)

    # Store AI message
    crud.add_message(
        db,
        schemas.MessageCreate(
            session_id=session.id,
            sender="ai",
            content=ai_reply
        )
    )

    return schemas.ChatResponse(session_id=session.id, message=ai_reply)
