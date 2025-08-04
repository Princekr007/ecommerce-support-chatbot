# Fixed crud.py - Use model_dump() and handle title field

from sqlalchemy.orm import Session
from . import models, schemas

# --- User CRUD ---
def create_user(db: Session, user: schemas.UserCreate):
    # Split name into first_name, use email for last_name if no space
    name_parts = user.name.split(' ', 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""
    
    db_user = models.User(
        first_name=first_name,
        last_name=last_name,
        email=user.email
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

# --- Session CRUD ---
def create_chat_session(db: Session, session: schemas.ChatSessionCreate):
    db_session = models.ChatSession(
        user_id=session.user_id,
        title=session.title or "New Chat"  # FIXED: Handle title field
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_chat_session(db: Session, session_id: int):
    return db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()

def get_all_chat_sessions(db: Session):
    return db.query(models.ChatSession).order_by(models.ChatSession.created_at.desc()).all()

# --- Message CRUD ---
def add_message(db: Session, message: schemas.MessageCreate):
    # FIXED: Use model_dump() for Pydantic v2 compatibility
    try:
        message_data = message.model_dump()  # Pydantic v2
    except AttributeError:
        message_data = message.dict()  # Pydantic v1 fallback
    
    db_msg = models.Message(**message_data)
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg

def get_messages_by_session(db: Session, session_id: int):
    return (
        db.query(models.Message)
        .filter(models.Message.session_id == session_id)
        .order_by(models.Message.timestamp)
        .all()
    )