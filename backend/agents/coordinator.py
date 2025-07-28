import asyncio
from typing import Dict, Any
from .base_agent import BaseAgent
from ..models.interview import InterviewConfig, AgentMessage

class CoordinatorAgent(BaseAgent):
    """Coordinates the entire interview session"""
    
    def __init__(self, session_id: str):
        super().__init__(session_id)
        self.phase_sequence = ["introduction", "behavioral", "coding", "analysis", "feedback"]
        self.current_phase_index = 0
    
    async def initialize(self, config: InterviewConfig) -> AgentMessage:
        """Initialize the coordinator with interview configuration"""
        await self.log_activity("Initializing interview session", {
            "role": config.role,
            "difficulty": config.difficulty,
            "duration": config.duration_minutes
        })
        
        self.initialized = True
        
        return await self.send_message(
            "system",
            f"Interview session initialized for {config.role} position. "
            f"Duration: {config.duration_minutes} minutes. "
            f"Multi-agent topology established.",
            {"config": config.dict()}
        )
    
    async def handle_message(self, action: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle coordinator-specific actions"""
        if action == "start_interview":
            return await self.start_interview()
        elif action == "next_phase":
            return await self.transition_to_next_phase()
        elif action == "get_status":
            return await self.get_session_status()
        else:
            return {"error": f"Unknown action: {action}"}
    
    async def start_interview(self) -> Dict[str, Any]:
        """Start the interview process"""
        await self.log_activity("Starting interview process")
        
        return {
            "action": "phase_transition",
            "current_phase": "behavioral",
            "message": "Transitioning to behavioral assessment phase",
            "instructions": {
                "agent": "behavioral",
                "action": "begin_assessment"
            }
        }
    
    async def transition_to_next_phase(self) -> Dict[str, Any]:
        """Transition to the next interview phase"""
        if self.current_phase_index < len(self.phase_sequence) - 1:
            self.current_phase_index += 1
            next_phase = self.phase_sequence[self.current_phase_index]
            
            await self.log_activity(f"Transitioning to phase: {next_phase}")
            
            return {
                "action": "phase_transition",
                "current_phase": next_phase,
                "message": f"Transitioning to {next_phase} phase",
                "instructions": self.get_phase_instructions(next_phase)
            }
        else:
            return {
                "action": "interview_complete",
                "message": "Interview completed successfully"
            }
    
    def get_phase_instructions(self, phase: str) -> Dict[str, Any]:
        """Get instructions for each phase"""
        instructions = {
            "behavioral": {
                "agent": "behavioral",
                "action": "begin_assessment",
                "parameters": {"question_count": 3, "method": "STAR"}
            },
            "coding": {
                "agent": "coding",
                "action": "present_challenge",
                "parameters": {"time_limit": 1200, "languages": ["python", "java", "cpp"]}
            },
            "analysis": {
                "agent": "analysis",
                "action": "analyze_session",
                "parameters": {"include_sentiment": True, "include_technical": True}
            },
            "feedback": {
                "agent": "feedback",
                "action": "generate_feedback",
                "parameters": {"include_recommendations": True}
            }
        }
        
        return instructions.get(phase, {})
    
    async def get_session_status(self) -> Dict[str, Any]:
        """Get current session status"""
        current_phase = self.phase_sequence[self.current_phase_index]
        
        return {
            "session_id": self.session_id,
            "current_phase": current_phase,
            "phase_index": self.current_phase_index,
            "total_phases": len(self.phase_sequence),
            "initialized": self.initialized
        }
