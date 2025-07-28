from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import asyncio
import json
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

from .agents.coordinator import CoordinatorAgent
from .agents.behavioral import BehavioralAgent
from .agents.coding import CodingAgent
from .agents.analysis import AnalysisAgent
from .agents.feedback import FeedbackAgent
from .agents.avatar import AvatarAgent
from .models.interview import InterviewConfig, InterviewSession, AgentMessage
from .services.judge0 import Judge0Service
from .services.vector_db import VectorDBService
from .services.livekit import LiveKitService

# Load environment variables
load_dotenv()

app = FastAPI(
    title="AI Recruiter Multi-Agent Platform",
    description="Enterprise-grade AI-powered interview system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global session storage (in production, use Redis or database)
active_sessions: Dict[str, InterviewSession] = {}

# Initialize services
judge0_service = Judge0Service()
vector_db_service = VectorDBService()
livekit_service = LiveKitService()

@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Initializing AI Recruiter Platform...")
    await vector_db_service.initialize()
    print("✓ Vector database connected")
    print("✓ Judge0 service ready")
    print("✓ LiveKit service initialized")

@app.get("/")
async def root():
    return {
        "message": "AI Recruiter Multi-Agent Platform",
        "version": "1.0.0",
        "status": "active",
        "agents": ["coordinator", "behavioral", "coding", "analysis", "feedback", "avatar"]
    }

@app.post("/api/interview/start")
async def start_interview(config: InterviewConfig):
    """Start a new interview session"""
    try:
        # Create new session
        session = InterviewSession(
            session_id=f"session_{len(active_sessions) + 1}",
            config=config,
            status="active"
        )
        
        # Initialize agents
        session.agents = {
            "coordinator": CoordinatorAgent(session.session_id),
            "behavioral": BehavioralAgent(session.session_id),
            "coding": CodingAgent(session.session_id, judge0_service),
            "analysis": AnalysisAgent(session.session_id, vector_db_service),
            "feedback": FeedbackAgent(session.session_id),
            "avatar": AvatarAgent(session.session_id, livekit_service)
        }
        
        active_sessions[session.session_id] = session
        
        # Start coordinator
        initial_message = await session.agents["coordinator"].initialize(config)
        session.messages.append(initial_message)
        
        return {
            "session_id": session.session_id,
            "status": "started",
            "message": initial_message.dict()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start interview: {str(e)}")

@app.websocket("/ws/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time communication"""
    await websocket.accept()
    
    if session_id not in active_sessions:
        await websocket.send_text(json.dumps({"error": "Session not found"}))
        await websocket.close()
        return
    
    session = active_sessions[session_id]
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Process message through appropriate agent
            response = await process_agent_message(session, message_data)
            
            # Send response back to client
            await websocket.send_text(json.dumps(response))
            
    except WebSocketDisconnect:
        print(f"Client disconnected from session {session_id}")
    except Exception as e:
        print(f"WebSocket error: {e}")
        await websocket.send_text(json.dumps({"error": str(e)}))

async def process_agent_message(session: InterviewSession, message_data: dict) -> dict:
    """Process message through the appropriate agent"""
    agent_type = message_data.get("agent")
    action = message_data.get("action")
    payload = message_data.get("payload", {})
    
    if agent_type not in session.agents:
        return {"error": f"Agent {agent_type} not found"}
    
    agent = session.agents[agent_type]
    
    try:
        if action == "ask_behavioral":
            response = await agent.ask_question(payload)
        elif action == "submit_response":
            response = await agent.process_response(payload)
        elif action == "execute_code":
            response = await agent.execute_code(payload)
        elif action == "analyze_session":
            response = await agent.analyze_session(session.messages)
        elif action == "generate_feedback":
            response = await agent.generate_feedback(payload)
        else:
            response = await agent.handle_message(action, payload)
        
        # Store message in session
        if isinstance(response, AgentMessage):
            session.messages.append(response)
            return response.dict()
        
        return response
        
    except Exception as e:
        return {"error": f"Agent processing failed: {str(e)}"}

@app.get("/api/interview/{session_id}/status")
async def get_interview_status(session_id: str):
    """Get current interview status"""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    return {
        "session_id": session_id,
        "status": session.status,
        "current_phase": session.current_phase,
        "message_count": len(session.messages),
        "scores": session.scores
    }

@app.post("/api/interview/{session_id}/end")
async def end_interview(session_id: str):
    """End interview session and generate report"""
    if session_id not in active_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = active_sessions[session_id]
    session.status = "completed"
    
    # Generate final report
    feedback_agent = session.agents["feedback"]
    final_report = await feedback_agent.generate_final_report(session)
    
    return {
        "session_id": session_id,
        "status": "completed",
        "report": final_report
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "services": {
            "judge0": await judge0_service.health_check(),
            "vector_db": await vector_db_service.health_check(),
            "livekit": await livekit_service.health_check()
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
