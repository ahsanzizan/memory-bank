import os
from dotenv import load_dotenv

load_dotenv()

DB_PATH = os.getenv('DB_PATH', "memory_bank_app.db")
OLLAMA_URL = os.getenv('OLLAMA_URL', "http://localhost:11434")
OLLAMA_MODEL = os.getenv('OLLAMA_MODEL', "nomic-embed-text")
