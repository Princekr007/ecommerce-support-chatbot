# Enhanced chat.py with correct field names and better error handling

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas, crud
from datetime import datetime
from app.utils.llm import generate_ai_response
from typing import List, Optional
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# REMOVE the /chat prefix since main.py already adds /api/chat
router = APIRouter(tags=["Chat"])

# --- USERS ---
@router.post("/users/", response_model=schemas.UserOut)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating user: {user.email}")
    return crud.create_user(db, user)

@router.get("/users/{user_id}", response_model=schemas.UserOut)
def read_user(user_id: int, db: Session = Depends(get_db)):
    logger.info(f"Reading user: {user_id}")
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.get("/users/by-email/{email}", response_model=schemas.UserOut)
def get_user_by_email(email: str, db: Session = Depends(get_db)):
    logger.info(f"Reading user by email: {email}")
    user = crud.get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# --- CHAT SESSIONS ---
@router.post("/sessions/", response_model=schemas.ChatSessionOut)
def create_session(session: schemas.ChatSessionCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating session for user: {session.user_id} with title: {session.title}")
    return crud.create_chat_session(db, session)

@router.get("/sessions/{session_id}", response_model=schemas.ChatSessionOut)
def read_session(session_id: int, db: Session = Depends(get_db)):
    logger.info(f"Reading session: {session_id}")
    session = crud.get_chat_session(db, session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

@router.get("/sessions/", response_model=List[schemas.ChatSessionOut])
def list_chat_sessions(
    user_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    logger.info(f"Listing sessions for user: {user_id}")
    query = db.query(models.ChatSession)
    if user_id is not None:
        query = query.filter(models.ChatSession.user_id == user_id)
    # FIXED: Use correct field name 'created_at'
    return query.order_by(models.ChatSession.created_at.desc()).all()

# --- MESSAGES ---
@router.post("/messages/", response_model=schemas.MessageOut)
def post_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating message for session: {message.session_id}")
    return crud.add_message(db, message)

@router.get("/sessions/{session_id}/messages", response_model=List[schemas.MessageOut])
def get_messages(session_id: int, db: Session = Depends(get_db)):
    logger.info(f"Getting messages for session: {session_id}")
    messages = crud.get_messages_by_session(db, session_id)
    logger.info(f"Found {len(messages)} messages")
    return messages

# --- CHAT INTERACTION ENDPOINT ---
@router.post("/", response_model=schemas.ChatResponse)
def chat(request: schemas.ChatRequest, db: Session = Depends(get_db)):
    logger.info(f"Chat request: user_id={request.user_id}, session_id={request.session_id}, message='{request.message[:50]}...'")
    
    try:
        # Validate user
        user = crud.get_user(db, request.user_id)
        if not user:
            logger.error(f"User not found: {request.user_id}")
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get or create session
        if request.session_id:
            session = crud.get_chat_session(db, request.session_id)
            if not session:
                logger.error(f"Session not found: {request.session_id}")
                raise HTTPException(status_code=404, detail="Session not found")
        else:
            logger.info("Creating new session")
            session = crud.create_chat_session(
                db, schemas.ChatSessionCreate(user_id=request.user_id, title="New Support Chat")
            )
        
        logger.info(f"Using session: {session.id}")
        
        # Store user message
        user_message = crud.add_message(
            db,
            schemas.MessageCreate(
                session_id=session.id,
                sender="user",
                content=request.message
            )
        )
        logger.info(f"Stored user message: {user_message.id}")
        
        # Generate AI reply
        try:
            ai_reply = generate_ai_response(request.message)
            logger.info(f"Generated AI reply: '{ai_reply[:50]}...'")
        except Exception as e:
            logger.error(f"Failed to generate AI response: {str(e)}")
            ai_reply = "I'm sorry, I'm having trouble processing your request right now. Please try again later."
        
        # Store AI message
        ai_message = crud.add_message(
            db,
            schemas.MessageCreate(
                session_id=session.id,
                sender="ai",
                content=ai_reply
            )
        )
        logger.info(f"Stored AI message: {ai_message.id}")
        
        logger.info(f"Chat completed successfully for session: {session.id}")
        return schemas.ChatResponse(session_id=session.id, message=ai_reply)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")