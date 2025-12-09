"""
Engineering AI - The Technical Department of Beechwood Corporation

Handles all coding, architecture, and technical implementation

Powered by Claude (Anthropic) for superior code generation
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
from anthropic import Anthropic

from core.config import config


class EngineeringAI:
    """
    Engineering AI Employee
    
    The technical expert that handles:
    - Code generation
    - Architecture design
    - Database schema creation
    - API design
    - Code review
    - Technical problem-solving
    """
    
    def __init__(self):
        """Initialize Engineering AI with Claude connection"""
        self.client = config.get_anthropic_client()
        self.name = "Engineering AI"
        self.department = "Engineering"
        self.specialty = "Full-stack development, architecture, code generation"
        
        # Conversation history for context
        self.conversation_history: List[Dict[str, str]] = []
        
        # System prompt - defines this AI's role and capabilities
        self.system_prompt = self._create_system_prompt()
        
        print(f"⚙️  {self.name} initialized")
        print(f"🏗️  Specialty: {self.specialty}")
    
    def _create_system_prompt(self) -> str:
        """Create the system prompt for Engineering AI"""
        return f"""You are the Engineering AI employee at {config.COMPANY_NAME}.

YOUR ROLE:
- You are a senior full-stack software engineer
- You handle all technical implementation for Beechwood projects
- You write production-ready, clean, well-documented code
- You design scalable architectures
- You provide technical solutions to problems

YOUR EXPERTISE:
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Python, FastAPI, Node.js
- Database: PostgreSQL, Supabase, Redis
- Architecture: System design, API design, database schema
- Best practices: Clean code, testing, documentation

CURRENT PROJECTS YOU WORK ON:
- Beechwood OS (Python, FastAPI)
- BEACON (Next.js, TypeScript, Supabase) - PRIMARY FOCUS
- i65Sports (Next.js)
- Future apps in the Beechwood ecosystem

WHEN GIVEN A TASK:
1. Understand the technical requirements
2. Design the solution architecture if needed
3. Write clean, production-ready code
4. Include comments explaining complex logic
5. Follow best practices and conventions
6. Consider scalability and maintainability

OUTPUT FORMAT:
- Provide complete, copy-paste-ready code
- Include file paths for where code should go
- Explain your technical decisions briefly
- Point out any dependencies that need to be installed

Current date: {datetime.now().strftime('%Y-%m-%d')}
"""
    
    def execute_task(
        self,
        task: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Execute a technical task
        
        Args:
            task: The engineering task to complete
            context: Optional additional context (files, requirements, etc.)
            
        Returns:
            Dictionary with code, explanation, and metadata
        """
        try:
            # Add context to the task if provided
            full_task = task
            if context:
                full_task += f"\n\nAdditional Context:\n{context}"
            
            # Add task to conversation history
            self.conversation_history.append({
                "role": "user",
                "content": full_task
            })
            
            # Call Claude API
            response = self.client.messages.create(
                model="claude-sonnet-4-20250514",  # Best for coding
                max_tokens=8192,  # Large for code generation
                system=self.system_prompt,
                messages=self.conversation_history
            )
            
            # Extract response
            assistant_message = response.content[0].text
            
            # Add to conversation history
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })
            
            return {
                "success": True,
                "agent": self.name,
                "department": self.department,
                "output": assistant_message,
                "timestamp": datetime.now().isoformat(),
                "tokens_used": response.usage.input_tokens + response.usage.output_tokens,
                "model": response.model
            }
            
        except Exception as e:
            error_message = f"Engineering AI error: {str(e)}"
            print(f"❌ {error_message}")
            
            return {
                "success": False,
                "agent": self.name,
                "department": self.department,
                "output": error_message,
                "timestamp": datetime.now().isoformat()
            }
    
    def review_code(self, code: str, filename: str) -> Dict[str, Any]:
        """
        Review code for quality, bugs, and improvements
        
        Args:
            code: The code to review
            filename: Name of the file being reviewed
            
        Returns:
            Review with suggestions and ratings
        """
        review_task = f"""Review this code for quality, potential bugs, and improvements:

File: {filename}
```
{code}
```

Provide:
1. Overall quality rating (1-10)
2. Security concerns (if any)
3. Performance issues (if any)
4. Best practice violations (if any)
5. Specific improvement suggestions
"""
        return self.execute_task(review_task)
    
    def design_architecture(self, feature_description: str) -> Dict[str, Any]:
        """
        Design technical architecture for a feature
        
        Args:
            feature_description: Description of what needs to be built
            
        Returns:
            Architecture design and implementation plan
        """
        architecture_task = f"""Design the technical architecture for this feature:

{feature_description}

Provide:
1. System architecture diagram (in text/ASCII)
2. Database schema needed
3. API endpoints required
4. Frontend components needed
5. Technology stack recommendations
6. Implementation phases
"""
        return self.execute_task(architecture_task)
    
    def clear_context(self):
        """Clear conversation history for fresh context"""
        self.conversation_history = []
        print("🧹 Engineering AI context cleared")
    
    def get_status(self) -> Dict[str, Any]:
        """Get current status of Engineering AI"""
        return {
            "name": self.name,
            "department": self.department,
            "specialty": self.specialty,
            "conversation_length": len(self.conversation_history),
            "status": "operational",
            "ai_provider": "Anthropic Claude Sonnet 4"
        }


# Create a global Engineering AI instance
engineering_ai = EngineeringAI()

