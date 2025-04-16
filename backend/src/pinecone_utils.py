import os
from typing import Any, Dict, List

from dotenv import load_dotenv
from pinecone import Pinecone, ServerlessSpec

load_dotenv()

pc = Pinecone(api_key=os.getenv('PINECONE_API_KEY'))

index_name = os.getenv('PINECONE_INDEX_NAME', 'memory-bank')
# !IMPORTANT Nomic embed text dimensions range from 64 to 768, with recommended output sizes of 768, 512, 256, 128, and 64
dimension = 768

if not pc.has_index(index_name):
    pc.create_index(
        name=index_name,
        dimension=dimension,
        metric='cosine',
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1"
        )
    )

index = pc.Index(index_name)


def upsert_embedding(entry_id: int, embedding: List[float], metadata: Dict[str, Any]):
    """Upsert an embedding to Pinecone"""
    try:
        index.upsert(
            vectors=[{
                'id': str(entry_id),
                'values': embedding,
                'metadata': metadata
            }]
        )
        return True
    except Exception as e:
        print(f"Error upserting to Pinecone: {e}")
        return False


def search_embeddings(query_embedding: List[float], limit: int = 10):
    """
    Search for similar embeddings in Pinecone

    Example Results:
    {
      'matches': [
        {
          'id': 'id1',
          'score': 0.98,
          'metadata': {'title': 'Some document title'}
        },
        {
          'id': 'id2',
          'score': 0.95,
          'metadata': {'title': 'Another document'}
        }
      ],
      'namespace': '',
      'usage': {
        'read_units': 1
      }
    }
    """
    try:
        #
        results = index.query(
            vector=query_embedding,
            top_k=limit,
            include_metadata=True
        )
        return results
    except Exception as e:
        print(f"Error searching in Pinecone: {e}")
        return None
