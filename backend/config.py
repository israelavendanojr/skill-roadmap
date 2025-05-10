import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Configuration for the application"""
    # Flask configuration
    DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 't')
    PORT = int(os.getenv('REACT_APP_PORT', 5000))
    
    # API keys
    SERP_API_KEY = os.getenv('SERP_API_KEY')
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
    GOOGLE_GENAI_API_KEY = os.getenv('GOOGLE_GENAI_API_KEY')
    
    # LLM configuration (hardcoded values)
    LLM_MODEL = 'gemini-1.5-pro'
    LLM_TEMPERATURE = 0.2
    
    # Validation
    VALID_SKILL_LEVELS = ['None', 'Beginner', 'Intermediate', 'Advanced', 'Expert']
    VALID_COMMITMENT_LEVELS = ['No rush', 'Moderate', 'Dedicated', 'Intensive']
    
    # System constants
    MIN_STEPS = 5
    MAX_STEPS = 50
    
    # Check required environment variables
    @classmethod
    def validate_config(cls):
        """Validate that all required environment variables are set"""
        required_vars = [
            'GOOGLE_GENAI_API_KEY'  # Only Gemini API is absolutely required
        ]
        
        missing_vars = [var for var in required_vars if not getattr(cls, var)]
        
        if missing_vars:
            raise EnvironmentError(f"Missing required environment variables: {', '.join(missing_vars)}")
        
        # Warn about missing optional API keys
        optional_vars = [
            ('SERP_API_KEY', 'Web search functionality'),
            ('YOUTUBE_API_KEY', 'YouTube video recommendations')
        ]
        
        warnings = []
        for var_name, feature in optional_vars:
            if not getattr(cls, var_name):
                warnings.append(f"{feature} will be limited without {var_name}")
        
        if warnings:
            print("WARNING: " + "; ".join(warnings))
        
        return True