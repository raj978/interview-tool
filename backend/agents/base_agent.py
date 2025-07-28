from abc import ABC, abstractmethod
from typing import Dict, Any, List
import asyncio
import datetime
from ..models.interview import AgentMessage

class BaseAgent(ABC):
    """Base class for all AI agents"""
    
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.agent_name = self.__class__.__name__
        self.initialized = False
    
    async def send_message(self, message_type: str, content: str, metadata: Dict[str, Any] = None) -> AgentMessage:
        """Send a message from this agent"""
        return AgentMessage(
            sender=self.agent_name,
            type=message_type,
            content=content,
            timestamp=datetime.datetime.now(),
            metadata=metadata or {}
        )
    
    @abstractmethod
    async def initialize(self, config: Any) -> AgentMessage:
        """Initialize the agent with configuration"""
        pass
    
    @abstractmethod
    async def handle_message(self, action: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Handle incoming messages"""
        pass
    
    async def log_activity(self, activity: str, details: Dict[str, Any] = None):
        """Log agent activity"""
        print(f"[{self.agent_name}] {activity}")
        if details:
            print(f"  Details: {details}")
