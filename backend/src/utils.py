import sqlite3
import json
import numpy as np
import requests
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

    cursor.execute('''
    CREATE TABLE IF NOT EXISTS embeddings (
      entry_id INTEGER,
      embedding_json TEXT NOT NULL,
      FOREIGN KEY (entry_id) REFERENCES entries(id),
      PRIMARY KEY (entry_id)
    )               
    ''')

    conn.commit()
    conn.close()

    print(f"Successfully initialized an SQLite database. in {DB_PATH}")


def generate_embedding(text: str):
    try:
        response = ollama.embed(model=OLLAMA_MODEL, input=text)

        if 'embeddings' in response and isinstance(response['embeddings'], list):
            return response['embeddings']
        else:
            print('Error with Ollama embeddings')
            return None

    except Exception as e:
        print(f'Error with Ollama embeddings: {e}')
        return None


def cosine_similarity(a: list[float], b: list[float]):
    """
    Calculate cosine similarity between two vectors.

    Args:
        a: First vector (list or numpy array)
        b: Second vector (list or numpy array)

    Returns:
        float: The cosine similarity between vectors a and b
    """
    # Convert to numpy arrays if they aren't already
    a_array = np.squeeze(np.asarray(a, dtype=np.float64))
    b_array = np.squeeze(np.asarray(b, dtype=np.float64))

    # Check for zero vectors
    norm_a = np.linalg.norm(a_array)
    norm_b = np.linalg.norm(b_array)

    if norm_a.shape != norm_b.shape:
        raise ValueError("Vectors must be of same length")

    if norm_a == 0 or norm_b == 0:
        return 0.0

    # Calculate similarity in one step
    return np.dot(a_array, b_array) / (norm_a * norm_b)
