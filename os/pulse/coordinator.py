"""
PULSE Coordinator - The Executive Brain of Beechwood OS
This is the AI CTO that coordinates all AI employees and manages tasks
NOW POWERED BY CLAUDE (Anthropic)
"""

import json
from datetime import datetime
from typing import Dict, List, Optional, Any
from anthropic import Anthropic

from core.config import config


class PulseCoordinator:
    """
    PULSE (Predictive Unified Logic System Engine)
    
    The AI CTO and executive coordinator for Beechwood Corporation.
    Responsibilities:
    - Route tasks to appropriate AI agents
    - Maintain context and memory
    - Provide strategic guidance
    - Coordinate between different departments
    """
    
    def __init__(self):
        """Initialize PULSE with Anthropic (Claude) connection"""
        self.client = config.get_anthropic_client()
        self.version = config.PULSE_VERSION
        self.name = config.PULSE_NAME
        self.company = config.COMPANY_NAME
        
        # Conversation history (memory)
        self.conversation_history: List[Dict[str, str]] = []
        
        # System prompt - defines PULSE's personality and role
        self.system_prompt = self._create_system_prompt()
        
        print(f"🧠 {self.name} v{self.version} initialized")
        print(f"🏢 Serving: {self.company}")
        print(f"🤖 AI Provider: Anthropic Claude")
    
    def _create_system_prompt(self) -> str:
        """
        Create the system prompt that defines PULSE's personality and role
        This is like PULSE's "job description"
        """
        return f"""You are PULSE (Predictive Unified Logic System Engine), the AI CTO and Chief Operating System of {self.company}.

YOUR ROLE:
- You are the executive coordinator of an AI-augmented corporation
- You manage specialized AI employees across different departments
- You provide brutally honest, strategic guidance
- You route tasks to appropriate AI agents
- You maintain context across all Beechwood projects

YOUR PERSONALITY:
- Direct and efficient
- Brutally honest but constructive
- Strategic thinker
- Proactive and predictive
- No unnecessary pleasantries, just results

CURRENT PROJECTS UNDER YOUR OVERSIGHT:
- i65 (social platform)
- i65Sports (sports community)
- W2GN (win-to-give-now platform)
- BEACON (emergency safety app) - IN ACTIVE DEVELOPMENT
- Beechwood OS (the AI corporation infrastructure) - IN ACTIVE DEVELOPMENT

When the CEO (user) gives you a task:
1. Understand the request
2. Determine which AI department/agent should handle it
3. Provide clear, actionable responses
4. Predict next steps proactively
5. Maintain brutal honesty about feasibility and challenges

Current version: {self.version}
Current date: {datetime.now().strftime('%Y-%m-%d')}
"""
    
    def process_request(
        self,
        user_message: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Process a request from the CEO using Claude
        
        Args:
            user_message: The message from the user
            context: Optional additional context
            
        Returns:
            Dictionary with response and metadata
        """
        try:
            # Add user message to conversation history
            self.conversation_history.append({
                "role": "user",
                "content": user_message
            })
            
            # Call Anthropic API
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",  # Latest Claude Sonnet
                max_tokens=4096,
                system=self.system_prompt,
                messages=self.conversation_history
            )
            
            # Extract the response
            assistant_message = response.content[0].text
            
            # Add assistant response to conversation history
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })
            
            # Return structured response
            return {
                "success": True,
                "response": assistant_message,
                "timestamp": datetime.now().isoformat(),
                "tokens_used": response.usage.input_tokens + response.usage.output_tokens,
                "model": response.model
            }
            
        except Exception as e:
            error_message = f"Error processing request: {str(e)}"
            print(f"❌ {error_message}")
            
            return {
                "success": False,
                "response": error_message,
                "timestamp": datetime.now().isoformat()
            }
    
    def clear_history(self):
        """Clear conversation history (fresh start)"""
        self.conversation_history = []
        print("🧹 Conversation history cleared")
    
    def get_status(self) -> Dict[str, Any]:
        """Get current status of PULSE"""
        return {
            "name": self.name,
            "version": self.version,
            "company": self.company,
            "ai_provider": "Anthropic Claude",
            "conversation_length": len(self.conversation_history),
            "status": "operational"
        }
    
    def route_to_agent(self, agent_name: str, task: str) -> Dict[str, Any]:
        """
        Route a task to a specific AI agent
        (For now, this is a placeholder - we'll build agents next)
        
        Args:
            agent_name: Name of the agent (e.g., "engineering", "product", "security")
            task: The task to route
            
        Returns:
            Response from the agent
        """
        return {
            "routed_to": agent_name,
            "task": task,
            "status": "Agent system not yet implemented",
            "note": "This will be connected to specialized AI employees"
        }


# Create a global PULSE instance
pulse = PulseCoordinator()