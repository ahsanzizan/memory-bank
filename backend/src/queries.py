import json
import sqlite3
from datetime import datetime
import numpy as np

from constants import DB_PATH
from utils import generate_embedding, cosine_similarity


def create_entry(content: str, timestamp: str):
    """Create a new entry in the database"""
    try:
        if content == '' or content == None:
            return {'success': False, 'error': 'Content cannot be empty'}

        if timestamp == '' or timestamp == None:
            timestamp = datetime.now().isoformat()

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        cursor.execute('''
        INSERT INTO entries (content, timestamp, created_at) VALUES (?, ?, ?)
        ''', (content, timestamp, datetime.now().isoformat()))

        embedding = generate_embedding(content)

        if embedding is None:
            conn.close()
            return {'success': False, 'error': 'Failed to generate embedding'}

        entry_id = cursor.lastrowid

        cursor.execute('''
        INSERT INTO embeddings (entry_id, embedding_json) VALUES (?, ?)               
        ''', (entry_id, json.dumps(embedding)))

        conn.commit()
        conn.close()

        return {'success': True, 'entry_id': entry_id}

    except Exception as e:
        return {'success': False, 'error': str(e)}


def get_entries():
    """Get entries from the database"""
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row

        cursor = conn.cursor()

        sql = 'SELECT id, content, timestamp, created_at FROM entries ORDER BY created_at DESC'

        cursor.execute(sql)

        entries = list(dict(row) for row in cursor.fetchall())

        conn.close()

        return {'success': True, 'entries': entries}
    except Exception as e:
        return {'success': False, 'error': str(e)}


def search_entries(query: str, limit: int = 10):
    """Search entries in the database."""
    try:
        if not query:
            return {'success': False, 'error': 'Query cannot be empty'}

        if limit < 1:
            return {'success': False, 'error': 'Limit must be greater than 0'}

        query_embedding = generate_embedding(query)

        if query_embedding is None:
            return {'success': False, 'error': 'Failed to generate embedding'}

        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row

        cursor = conn.cursor()

        cursor.execute('SELECT entry_id, embedding_json FROM embeddings')
        all_embeddings = {row['entry_id']: np.array(json.loads(
            row['embedding_json'])) for row in cursor.fetchall()}

        similarities = {
            id: cosine_similarity(np.array(query_embedding), embedding)
            for id, embedding in all_embeddings.items()
        }

        top_ids = sorted(similarities, key=similarities.get,
                         reverse=True)[:limit]

        cursor.execute(f'''
        SELECT id, content, timestamp FROM entries WHERE id IN ({",".join('?' * len(top_ids))})               
        ''', top_ids)

        results = [{
            'id': row['id'],
            'content': row['content'],
            'timestamp': row['timestamp'],
            'similarity': similarities[row['id']]
        } for row in cursor.fetchall()]

        conn.close()

        return {'success': True, 'results': results}
    except Exception as e:
        return {'success': False, 'error': str(e)}
