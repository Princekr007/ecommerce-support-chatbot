# Fixed schemas.py - Remove field mapping since we fixed the model

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
    title: Optional[str] = "New Chat"  # ADDED: title field

class ChatSessionOut(BaseModel):
    id: int
    user_id: int
    title: Optional[str] = None
    created_at: datetime  # FIXED: No more alias needed
    messages: List[MessageOut] = []
    
    class Config:
        from_attributes = True

# --- USERS ---
class UserCreate(BaseModel):
    name: str
    email: str

class UserOut(BaseModel):
    id: int
    first_name: Optional[str] = None  # FIXED: Use actual field names
    last_name: Optional[str] = None
    email: str
    
    class Config:
        from_attributes = True

# --- CHAT INTERACTION ---
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
    title: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True