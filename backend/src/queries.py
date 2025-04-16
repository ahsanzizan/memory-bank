import sqlite3
from datetime import datetime

from constants import DB_PATH
from pinecone_utils import search_embeddings, upsert_embedding
from utils import generate_embedding


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

        # Store in Pinecone
        metadata = {
            'content': content,
            'timestamp': timestamp
        }
        if not upsert_embedding(entry_id, embedding, metadata):
            conn.close()
            return {'success': False, 'error': 'Failed to store embedding in Pinecone'}

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

        # Search in Pinecone
        search_results = search_embeddings(query_embedding, limit)

        if search_results is None:
            return {'success': False, 'error': 'Failed to search in Pinecone'}

        # Get full entry details from SQLite
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        entry_ids = [int(match['id']) for match in search_results['matches']]
        if not entry_ids:
            return {'success': True, 'results': []}

        cursor.execute(f'''
        SELECT id, content, timestamp FROM entries WHERE id IN ({",".join('?' * len(entry_ids))})               
        ''', entry_ids)

        results = []
        for row in cursor.fetchall():
            match = next(m for m in search_results['matches'] if int(
                m['id']) == row['id'])
            results.append({
                'id': row['id'],
                'content': row['content'],
                'timestamp': row['timestamp'],
                'similarity': match['score']
            })

        conn.close()

        return {'success': True, 'results': results}
    except Exception as e:
        return {'success': False, 'error': str(e)}
