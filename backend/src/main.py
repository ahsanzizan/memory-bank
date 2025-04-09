from datetime import datetime

from constants import DB_PATH, OLLAMA_MODEL, OLLAMA_URL
from flask import Flask, jsonify, request
from flask_cors import CORS
from queries import create_entry, get_entries, search_entries
from utils import initialize_db

app = Flask(__name__)

CORS(app)


@app.route('/api/entries', methods=['POST'])
def create_entry_route():
    data = request.json
    content = data.get('content', '')

    now = datetime.now().isoformat()

    result = create_entry(content, now)

    if result['success']:
        return jsonify({'success': True, 'entry_id': result['entry_id']}), 201
    else:
        return jsonify({'success': False, 'error': result['error']}), 500


@app.route('/api/entries', methods=['GET'])
def get_entries_route():
    results = get_entries()

    if results['success']:
        return jsonify({'success': True, 'entries': results['entries']}), 200
    else:
        return jsonify({'success': False, 'error': results['error']}), 500


@app.route('/api/search', methods=['GET'])
def search_entries_route():
    query = request.args.get('query', '')
    limit = request.args.get('limit', 10)

    try:
        limit = int(limit)
    except ValueError:
        return jsonify({'success': False, 'error': 'Invalid limit'}), 400

    result = search_entries(query, limit)

    if result['success']:
        return jsonify({'success': True, 'results': result['results']}), 200
    else:
        return jsonify({'success': False, 'error': result['error']}), 500


if __name__ == '__main__':
    initialize_db()
    app.run(debug=True, port=5000)
