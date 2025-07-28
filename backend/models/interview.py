from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from enum import Enum
import datetime

class InterviewPhase(str, Enum):
    INTRODUCTION = "introduction"
    BEHAVIORAL = "behavioral"
    CODING = "coding"
    ANALYSIS = "analysis"
    FEEDBACK = "feedback"

class InterviewConfig(BaseModel):
    role: str
    difficulty: str
    languages_allowed: List[str]
    duration_minutes: int
    realtime_hints: bool
    voice: str
    rubric_id: str
    video_avatar: str

class AgentMessage(BaseModel):
    sender: str
    type: str
    content: str
    timestamp: datetime.datetime
    metadata: Optional[Dict[str, Any]] = {}

class InterviewScores(BaseModel):
    culture: int = 0
    communication: int = 0
    problem_solving: int = 0
    technical: int = 0
    overall: int = 0

class InterviewSession(BaseModel):
    session_id: str
    config: InterviewConfig
    status: str
    current_phase: InterviewPhase = InterviewPhase.INTRODUCTION
    messages: List[AgentMessage] = []
    scores: InterviewScores = InterviewScores()
    agents: Optional[Dict[str, Any]] = {}
    created_at: datetime.datetime = datetime.datetime.now()

class BehavioralResponse(BaseModel):
    transcript: str
    sentiment: Dict[str, float]
    keywords: List[str]

class CodingResult(BaseModel):
    pass_rate: float
    exec_time_ms: int
    stderr: str
    passed: int
    total: int
    memory_usage: Optional[int] = None
