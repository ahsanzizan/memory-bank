# Memory Bank

A personal knowledge management application that uses state-of-the-art open-source embedding models for semantic search and retrieval.

## Features

- Store and retrieve personal notes and memories
- Semantic search using vector embeddings
- Modern React frontend with TypeScript
- Flask backend with SQLite and Pinecone
- Uses Ollama for local embedding generation

## Tech Stack

### Frontend

- React + TypeScript
- Vite
- Tailwind CSS
- Shadcn UI components

### Backend

- Python Flask
- SQLite for content storage
- Pinecone for vector storage
- Ollama for local embedding generation
- NumPy for vector operations

## Project Structure

```
memory-bank/
├── frontend/           # React frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── package.json   # Frontend dependencies
├── backend/           # Flask backend application
│   ├── src/          # Source code
│   │   ├── main.py   # Flask application
│   │   ├── utils.py  # Utility functions
│   │   ├── queries.py # Database operations
│   │   └── pinecone_utils.py # Pinecone operations
│   └── requirements.txt # Backend dependencies
└── Makefile          # Development commands
```

## Prerequisites

- Python 3.8+
- Node.js 16+
- Ollama running locally
- Pinecone account and API key

## Setup

1. Clone the repository:

```bash
git clone <repository-url>
cd memory-bank
```

2. Install dependencies:

```bash
make install
```

3. Configure environment variables:
   Create a `.env` file in the backend directory with:

```
DB_PATH=memory_bank_app.db
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=nomic-embed-text
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=memory-bank
```

4. Start Ollama:

```bash
ollama serve
```

## Development

Run both frontend and backend servers:

```bash
make run-all
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### Available Make Commands

- `make install` - Install all dependencies
- `make run-backend` - Run only the backend server
- `make run-frontend` - Run only the frontend server
- `make run-all` - Run both servers concurrently
- `make clean` - Clean up generated files

## How It Works

1. **Content Storage**:

   - Text content is stored in SQLite database
   - Each entry is associated with a vector embedding

2. **Embedding Generation**:

   - Uses Ollama's nomic-embed-text model for local embedding generation
   - Embeddings are stored in Pinecone for efficient vector search

3. **Semantic Search**:
   - Search queries are converted to embeddings
   - Pinecone performs vector similarity search
   - Results are ranked by similarity score

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
