"""
Configuration Manager for Beechwood OS
Loads environment variables and provides them to the system
"""

import os
from dotenv import load_dotenv
from typing import Optional

# Load environment variables from .env file
load_dotenv()

class Config:
    """
    Configuration class that holds all API keys and settings
    Think of this as a safe that stores all your secrets
    """
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "")
    SUPABASE_SERVICE_KEY: str = os.getenv("SUPABASE_SERVICE_KEY", "")
    
    # Upstash Redis Configuration
    UPSTASH_REDIS_REST_URL: str = os.getenv("UPSTASH_REDIS_REST_URL", "")
    UPSTASH_REDIS_REST_TOKEN: str = os.getenv("UPSTASH_REDIS_REST_TOKEN", "")
    
    # AI Provider Configuration
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    ANTHROPIC_API_KEY: str = os.getenv("ANTHROPIC_API_KEY", "")
    
    # Environment Settings
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True") == "True"
    
    # PULSE Configuration
    PULSE_VERSION: str = os.getenv("PULSE_VERSION", "0.1.0")
    PULSE_NAME: str = os.getenv("PULSE_NAME", "PULSE")
    COMPANY_NAME: str = os.getenv("COMPANY_NAME", "Beechwood Corporation")
    
    @classmethod
    def validate(cls) -> bool:
        """
        Check if all required keys are present
        Returns True if everything is configured, False otherwise
        """
        required_keys = [
            cls.SUPABASE_URL,
            cls.SUPABASE_ANON_KEY,
            cls.ANTHROPIC_API_KEY,
        ]
        
        # Check if any required key is missing
        missing_keys = [key for key in required_keys if not key]
        
        if missing_keys:
            print("❌ Missing required configuration!")
            return False
        
        print("✅ Configuration loaded successfully")
        return True
    
    @classmethod
    def get_anthropic_client(cls):
        """
        Create and return an Anthropic client
        This is what PULSE and AI employees use to "think"
        """
        from anthropic import Anthropic
        return Anthropic(api_key=cls.ANTHROPIC_API_KEY)
    
    @classmethod
    def get_openai_client(cls):
        """
        Create and return an OpenAI client (backup/fallback)
        """
        from openai import OpenAI
        return OpenAI(api_key=cls.OPENAI_API_KEY)
    
    @classmethod
    def get_supabase_client(cls):
        """
        Create and return a Supabase client
        This is what PULSE uses to store data
        """
        from supabase import create_client
        return create_client(cls.SUPABASE_URL, cls.SUPABASE_ANON_KEY)


# Create a global config instance
config = Config()

# Validate on import
if not config.validate():
    print("⚠️  Warning: Some configuration values are missing")