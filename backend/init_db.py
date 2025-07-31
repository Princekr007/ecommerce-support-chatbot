# init_db.py

from sqlalchemy import create_engine
from app.models import Base  # Ensure your models are imported here
import os

# Update this connection string if you're using another DB (like PostgreSQL)
DATABASE_URL = "sqlite:///test.db"

engine = create_engine(DATABASE_URL)

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database tables created.")

if __name__ == "__main__":
    init_db()
