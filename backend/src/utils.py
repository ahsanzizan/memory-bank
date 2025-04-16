import sqlite3
import numpy as np
import ollama
from constants import DB_PATH, OLLAMA_MODEL, OLLAMA_URL


def initialize_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            created_at TEXT NOT NULL
    )
    ''')

    conn.commit()
    conn.close()

    print(f"Successfully initialized an SQLite database. in {DB_PATH}")


def generate_embedding(text: str):
    try:
        response = ollama.embed(model=OLLAMA_MODEL, input=text)

        if 'embeddings' in response and isinstance(response['embeddings'], list):
            # Convert to numpy array and ensure float type
            embeddings = np.array(response['embeddings'], dtype=float)
            # Convert back to list for Pinecone
            return embeddings.tolist()[0]
        else:
            print('Error with Ollama embeddings: Invalid response format')
            return None

    except Exception as e:
        print(f'Error with Ollama embeddings: {e}')
        return None
