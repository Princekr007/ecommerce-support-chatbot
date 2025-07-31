from sqlalchemy.orm import Session
from . import models, schemas

# --- User CRUD ---
def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(name=user.name, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


# --- Session CRUD ---
def create_chat_session(db: Session, session: schemas.ChatSessionCreate):
    db_session = models.ChatSession(user_id=session.user_id)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_chat_session(db: Session, session_id: int):
    return db.query(models.ChatSession).filter(models.ChatSession.id == session_id).first()

# ✅ Optimized: Get all chat sessions (lightweight for history view)
def get_all_chat_sessions(db: Session):
    return db.query(models.ChatSession).order_by(models.ChatSession.created_at.desc()).all()


# --- Message CRUD ---
def add_message(db: Session, message: schemas.MessageCreate):
    db_msg = models.Message(**message.dict())
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
