import os
import numpy as np
from typing import List, Dict, Any, Optional
import asyncio
import json

class VectorDBService:
    """Service for vector database operations (simulated)"""
    
    def __init__(self):
        self.api_key = os.getenv("PINECONE_API_KEY")
        self.environment = os.getenv("PINECONE_ENVIRONMENT")
        self.index_name = "interview-rubrics"
        self.initialized = False
        
        # Simulated vector storage
        self.vectors = {}
        self.rubrics = {}
    
    async def initialize(self):
        """Initialize vector database connection"""
        if self.api_key:
            # In production, initialize Pinecone here
            pass
        
        # Load default rubrics
        await self.load_default_rubrics()
        self.initialized = True
    
    async def load_default_rubrics(self):
        """Load default interview rubrics"""
        
        default_rubrics = {
            "backend_v3": {
                "role": "Backend Software Engineer",
                "competencies": {
                    "technical_skills": {
                        "weight": 0.4,
                        "keywords": ["algorithm", "database", "api", "system", "architecture", "performance", "scalability"],
                        "benchmarks": {
                            "junior": 60,
                            "mid": 75,
                            "senior": 85
                        }
                    },
                    "problem_solving": {
                        "weight": 0.3,
                        "keywords": ["problem", "solution", "debug", "troubleshoot", "optimize", "analyze"],
                        "benchmarks": {
                            "junior": 65,
                            "mid": 80,
                            "senior": 90
                        }
                    },
                    "communication": {
                        "weight": 0.2,
                        "keywords": ["explain", "communicate", "collaborate", "document", "present"],
                        "benchmarks": {
                            "junior": 70,
                            "mid": 80,
                            "senior": 85
                        }
                    },
                    "culture_fit": {
                        "weight": 0.1,
                        "keywords": ["team", "leadership", "initiative", "learning", "adaptability"],
                        "benchmarks": {
                            "junior": 75,
                            "mid": 80,
                            "senior": 85
                        }
                    }
                }
            },
            "frontend_v3": {
                "role": "Frontend Software Engineer",
                "competencies": {
                    "technical_skills": {
                        "weight": 0.4,
                        "keywords": ["react", "javascript", "css", "html", "ui", "ux", "responsive", "performance"],
                        "benchmarks": {
                            "junior": 60,
                            "mid": 75,
                            "senior": 85
                        }
                    },
                    "design_sense": {
                        "weight": 0.25,
                        "keywords": ["design", "user", "interface", "experience", "accessibility", "usability"],
                        "benchmarks": {
                            "junior": 65,
                            "mid": 75,
                            "senior": 85
                        }
                    },
                    "problem_solving": {
                        "weight": 0.25,
                        "keywords": ["problem", "solution", "debug", "optimize", "performance"],
                        "benchmarks": {
                            "junior": 65,
                            "mid": 80,
                            "senior": 90
                        }
                    },
                    "communication": {
                        "weight": 0.1,
                        "keywords": ["explain", "communicate", "collaborate", "feedback"],
                        "benchmarks": {
                            "junior": 70,
                            "mid": 80,
                            "senior": 85
                        }
                    }
                }
            }
        }
        
        self.rubrics = default_rubrics
    
    async def store_candidate_response(self, session_id: str, response_data: Dict[str, Any]) -> bool:
        """Store candidate response as vector embedding"""
        
        try:
            # In production, convert text to embeddings using OpenAI or similar
            # For now, simulate storage
            
            if session_id not in self.vectors:
                self.vectors[session_id] = []
            
            # Simulate vector embedding (in production, use actual embedding model)
            text_content = response_data.get("content", "")
            simulated_vector = self.simulate_text_embedding(text_content)
            
            vector_data = {
                "id": f"{session_id}_{len(self.vectors[session_id])}",
                "vector": simulated_vector,
                "metadata": {
                    "session_id": session_id,
                    "timestamp": response_data.get("timestamp"),
                    "type": response_data.get("type"),
                    "content": text_content[:500],  # Store first 500 chars
                    "agent": response_data.get("agent")
                }
            }
            
            self.vectors[session_id].append(vector_data)
            return True
            
        except Exception as e:
            print(f"Error storing vector: {e}")
            return False
    
    async def query_similar_responses(self, session_id: str, query_text: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """Query for similar responses"""
        
        if session_id not in self.vectors:
            return []
        
        # Simulate similarity search
        query_vector = self.simulate_text_embedding(query_text)
        session_vectors = self.vectors[session_id]
        
        # Calculate cosine similarity (simulated)
        similarities = []
        for vector_data in session_vectors:
            similarity = self.cosine_similarity(query_vector, vector_data["vector"])
            similarities.append({
                "similarity": similarity,
                "data": vector_data
            })
        
        # Sort by similarity and return top_k
        similarities.sort(key=lambda x: x["similarity"], reverse=True)
        return [item["data"] for item in similarities[:top_k]]
    
    async def get_rubric(self, rubric_id: str) -> Optional[Dict[str, Any]]:
        """Get interview rubric by ID"""
        return self.rubrics.get(rubric_id)
    
    async def calculate_competency_scores(self, session_id: str, rubric_id: str) -> Dict[str, float]:
        """Calculate competency scores based on rubric"""
        
        rubric = await self.get_rubric(rubric_id)
        if not rubric:
            return {}
        
        if session_id not in self.vectors:
            return {}
        
        session_vectors = self.vectors[session_id]
        competency_scores = {}
        
        for competency, config in rubric["competencies"].items():
            keywords = config["keywords"]
            weight = config["weight"]
            
            # Calculate score based on keyword presence and context
            total_score = 0
            total_responses = len(session_vectors)
            
            for vector_data in session_vectors:
                content = vector_data["metadata"]["content"].lower()
                keyword_matches = sum(1 for keyword in keywords if keyword in content)
                keyword_score = min(keyword_matches / len(keywords), 1.0)
                
                # Simulate context understanding (in production, use semantic similarity)
                context_score = np.random.uniform(0.6, 1.0)  # Simulate good context understanding
                
                response_score = (keyword_score * 0.6 + context_score * 0.4) * 100
                total_score += response_score
            
            avg_score = total_score / total_responses if total_responses > 0 else 0
            competency_scores[competency] = min(avg_score, 100)
        
        return competency_scores
    
    def simulate_text_embedding(self, text: str) -> List[float]:
        """Simulate text embedding (in production, use OpenAI embeddings)"""
        # Create a simple hash-based embedding simulation
        import hashlib
        
        hash_obj = hashlib.md5(text.encode())
        hash_hex = hash_obj.hexdigest()
        
        # Convert to 384-dimensional vector (simulating sentence-transformers)
        vector = []
        for i in range(0, len(hash_hex), 2):
            val = int(hash_hex[i:i+2], 16) / 255.0  # Normalize to 0-1
            vector.append(val)
        
        # Pad to 384 dimensions
        while len(vector) < 384:
            vector.append(np.random.uniform(-0.1, 0.1))
        
        return vector[:384]
    
    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity between two vectors"""
        vec1 = np.array(vec1)
        vec2 = np.array(vec2)
        
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return dot_product / (norm1 * norm2)
    
    async def health_check(self) -> bool:
        """Check if vector database is healthy"""
        return self.initialized
