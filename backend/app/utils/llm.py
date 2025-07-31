import requests
import os
from dotenv import load_dotenv
load_dotenv()


GROQ_API_KEY = os.getenv("GROQ_API_KEY")  # Store in .env and load it securely
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def generate_ai_response(user_message: str) -> str:
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama3-8b-8192",  # or llama3-70b-8192
        "messages": [
            {"role": "system", "content": "You're a helpful assistant."},
            {"role": "user", "content": user_message}
        ]
    }

    response = requests.post(GROQ_API_URL, headers=headers, json=payload)
    response.raise_for_status()

    data = response.json()
    return data["choices"][0]["message"]["content"].strip()

