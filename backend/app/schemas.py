from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- MESSAGES ---

class MessageCreate(BaseModel):
    session_id: int
    sender: str
    content: str

class MessageOut(BaseModel):
    id: int
    session_id: int
    sender: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True

# --- SESSIONS ---

class ChatSessionCreate(BaseModel):
    user_id: int

class ChatSessionOut(BaseModel):
    id: int
    user_id: int
    created_at: datetime
    messages: List[MessageOut] = []

    class Config:
        from_attributes = True

# --- USERS ---

class UserCreate(BaseModel):
    name: str
    email: str

class UserOut(BaseModel):
    id: int
    name: str
    email: str 
    sessions: List[ChatSessionOut] = []

    class Config:
        from_attributes = True

# --- CHAT INTERACTION (Frontend ↔️ Backend) ---

class ChatRequest(BaseModel):
    user_id: int
    session_id: Optional[int] = None
    message: str

class ChatResponse(BaseModel):
    session_id: int
    message: str
    
class ChatSessionSimple(BaseModel):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True
