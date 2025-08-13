# app/utils/llm.py
import os
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_ai_response(user_message: str) -> str:
    if not GROQ_API_KEY:
        # Fallback so chat still works without crashing
        return "AI is not configured yet. Please set GROQ_API_KEY."

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "llama3-8b-8192",
        "messages": [
            {"role": "system", "content": "You're a helpful assistant."},
            {"role": "user", "content": user_message},
        ],
        "temperature": 0.5,
        "max_tokens": 512,
    }

    resp = requests.post(GROQ_API_URL, headers=headers, json=payload, timeout=30)
    resp.raise_for_status()
    data = resp.json()
    return data["choices"][0]["message"]["content"].strip()
