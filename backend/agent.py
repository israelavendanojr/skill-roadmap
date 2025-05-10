import json
import re
from dotenv import load_dotenv
import os
from typing import Dict, List, Any, Optional
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from llama_index.llms.gemini import Gemini

# Import our tools
from tools import (
    search_wikipedia, 
    search_web, 
    search_youtube, 
    generate_timeline,
    format_learning_plan
)
from config import Config

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GOOGLE_GENAI_API_KEY')

def generate_steps(
    goal: str,
    skill: str,
    skill_level: Dict[str, str],
    commitment_level: str
) -> Dict[str, Any]:
    """
    Generate a personalized learning plan with steps for achieving a goal using Gemini LLM.
    
    Args:
        goal: User's goal statement (e.g., "I want to learn Spanish to travel South America")
        skill: The main skill to learn (e.g., "Spanish")
        skill_level: Dict with 'current' and 'target' skill levels
        commitment_level: User's commitment level
        
    Returns:
        Complete learning plan as a dictionary
    """
    # Create the Gemini LLM wrapper for llama_index
    llm = Gemini(
        api_key=GEMINI_API_KEY,
        model_name=Config.LLM_MODEL,
        temperature=Config.LLM_TEMPERATURE
    )
    
    # Create function tools for the agent
    wikipedia_tool = FunctionTool.from_defaults(
        name="search_wikipedia",
        description="Search Wikipedia for information related to a learning topic",
        fn=search_wikipedia
    )
    
    web_search_tool = FunctionTool.from_defaults(
        name="search_web",
        description="Search the web for learning resources and information",
        fn=search_web
    )
    
    youtube_search_tool = FunctionTool.from_defaults(
        name="search_youtube",
        description="Search YouTube for educational videos related to a topic",
        fn=search_youtube
    )
    
    timeline_tool = FunctionTool.from_defaults(
        name="generate_timeline",
        description="Generate a realistic timeline based on skill levels and commitment",
        fn=generate_timeline
    )
    
    format_tool = FunctionTool.from_defaults(
        name="format_learning_plan",
        description="Format the complete learning plan response",
        fn=format_learning_plan
    )
    
    # Define the system prompt
    system_prompt = f"""
    You are an AI learning path planner. Your goal is to create detailed, personalized learning plans.
    
    The user wants to {goal}. They want to learn {skill}.
    Their current skill level is: {skill_level['current']}
    Their target skill level is: {skill_level['target']}
    Their commitment level is: {commitment_level}
    
    IMPORTANT: You MUST ALWAYS use the provided tools in a specific sequence and NEVER generate the final response directly. 
    
    Follow these steps in order:
    1. First, use the generate_timeline tool to create a realistic timeline
    2. For EACH milestone, you MUST create MULTIPLE specific action steps (at least 3-4 steps per milestone)
       - Steps should build on each other in increasing difficulty
       - Steps should cover different aspects of learning the skill
       - For example, in learning piano, separate steps would include keyboard layout, hand positioning, rhythm practice, etc.
    3. You MUST create a TOTAL of AT LEAST 5 steps and at most {Config.MAX_STEPS} steps
    4. For each step, use the search tools (Wikipedia, web, YouTube) to find relevant resources
    5. For each step, include:
       - A unique ID (e.g., "step-1", "step-2")
       - A clear, actionable task title
       - A detailed description (2-3 sentences)
       - Estimated time to complete (hours/days)
       - Difficulty level (Easy, Medium, Hard)
       - 2-3 resources (articles, videos, exercises) with titles and URLs
       - Expected outcome or how to measure completion
       - The ID of the milestone this step belongs to
    
    6. ALWAYS conclude by using the format_learning_plan tool to return the complete plan as a structured JSON object
    
    CRITICAL: The output MUST have AT LEAST 5 distinct steps total, NOT just one step per milestone.
    When defining steps, be concrete and specific rather than general.
    
    THE OUTPUT MUST BE A STRUCTURED JSON OBJECT, NOT PLAIN TEXT.
    """
    
    # Create ReAct agent with our tools and LLM
    tools = [
        wikipedia_tool,
        web_search_tool, 
        youtube_search_tool,
        timeline_tool,
        format_tool
    ]
    
    agent = ReActAgent.from_tools(
        tools,
        llm=llm,
        verbose=True,
        system_prompt=system_prompt,
        max_iterations=50  # Increase from default to avoid premature stopping
    )
    
    # Define the initial query to the agent
    query = f"""
    Create a learning plan for:
    - Goal: {goal}
    - Skill: {skill}
    - Current level: {skill_level['current']}
    - Target level: {skill_level['target']}
    - Commitment: {commitment_level}
    
    IMPORTANT: You MUST create AT LEAST 5 distinct steps in total, not just one step per milestone.
    You MUST use the generate_timeline tool first, then create multiple steps for each milestone, research resources for each step, and ALWAYS finish by using the format_learning_plan tool to return the plan as a structured JSON object.
    """
    
    # Get response from agent
    response = agent.chat(query)
    result = response.response
    
    # Parse if needed (depending on how the agent returns data)
    try:
        # First check if it's already a dictionary
        if isinstance(result, dict):
            return result
            
        # If it's a string, try to parse as JSON
        if isinstance(result, str):
            # Clean up the string to handle potential markdown formatting
            if '```json' in result:
                # Extract JSON from code blocks
                json_match = re.search(r'```json\n(.*?)\n```', result, re.DOTALL)
                if json_match:
                    result = json_match.group(1).strip()
            elif '```' in result:
                # Extract from generic code blocks
                json_match = re.search(r'```\n(.*?)\n```', result, re.DOTALL)
                if json_match:
                    result = json_match.group(1).strip()
            
            # Try to parse the result as JSON
            if result.strip().startswith('{'):
                return json.loads(result)
            
        # If we still don't have a parseable JSON, let's create a synthetic one
        # This is a fallback to ensure we always return a structured response
        print("Warning: Could not parse response as JSON, creating synthetic structure")
        
        # Basic extraction of milestones and steps from text
        milestone_pattern = r'(?:Milestone|Phase|Stage)\s*\d+:?\s*([^:]+)(?:\s*\(([^)]+)\))?'
        milestones = re.findall(milestone_pattern, result, re.IGNORECASE) or [("None to Beginner", "8 weeks")]
        
        step_pattern = r'(?:Step|Task)\s*\d+:?\s*([^:\n]+)'
        steps = re.findall(step_pattern, result, re.IGNORECASE)
        
        # If we can't extract steps, look for bullet points
        if not steps:
            bullet_pattern = r'[-*•]\s*([^\n]+)'
            steps = re.findall(bullet_pattern, result)
            
        # If we still don't have steps, just split by newlines and take non-empty lines
        if not steps:
            steps = [line.strip() for line in result.split('\n') if line.strip() and not line.startswith('#')]
            # Limit to reasonable number of steps
            steps = steps[:min(len(steps), 10)]
            
        # Generate a timeline
        timeline = generate_timeline(
            skill_level=skill_level,
            commitment_level=commitment_level
        )
        
        # Generate synthetic steps
        synthetic_steps = []
        for i, step_text in enumerate(steps[:Config.MAX_STEPS]):
            # Determine which milestone this step belongs to
            milestone_index = min(i // 5, len(timeline["milestones"]) - 1)  # 5 steps per milestone
            milestone_id = timeline["milestones"][milestone_index]["id"]
            
            # Create the step
            synthetic_step = {
                "id": f"step-{i+1}",
                "title": step_text,
                "description": f"This step involves {step_text.lower()}. This is an important part of learning {skill}.",
                "time_estimate": f"{(i % 3) + 1} week{'s' if (i % 3) > 0 else ''}",
                "difficulty": ["Easy", "Medium", "Hard"][min(i // 3, 2)],
                "resources": [
                    {
                        "title": f"Learn {step_text}",
                        "url": f"https://example.com/{skill.lower().replace(' ', '-')}/{i+1}",
                        "type": "article"
                    },
                    {
                        "title": f"{step_text} - Video Tutorial",
                        "url": f"https://example.com/video/{skill.lower().replace(' ', '-')}/{i+1}",
                        "type": "video"
                    }
                ],
                "expected_outcome": f"Ability to {step_text.lower()}",
                "milestone_id": milestone_id
            }
            
            synthetic_steps.append(synthetic_step)
            
        # Ensure we have minimum number of steps
        while len(synthetic_steps) < Config.MIN_STEPS:
            i = len(synthetic_steps)
            milestone_index = min(i // 5, len(timeline["milestones"]) - 1)
            milestone_id = timeline["milestones"][milestone_index]["id"]
            
            synthetic_step = {
                "id": f"step-{i+1}",
                "title": f"Additional practice for {skill}",
                "description": f"Reinforce your learning with additional practice sessions. Practice is essential for mastering {skill}.",
                "time_estimate": "1 week",
                "difficulty": "Medium",
                "resources": [
                    {
                        "title": f"Practice exercises for {skill}",
                        "url": f"https://example.com/{skill.lower().replace(' ', '-')}/practice",
                        "type": "exercise"
                    }
                ],
                "expected_outcome": f"Increased confidence and skill in {skill}",
                "milestone_id": milestone_id
            }
            
            synthetic_steps.append(synthetic_step)
            
        return {
            "goal": goal,
            "skill": skill,
            "timeline": timeline,
            "steps": synthetic_steps
        }
            
    except Exception as e:
        print(f"Error parsing agent response: {str(e)}")
        # Create a minimal valid response structure as a last resort
        return {
            "error": str(e),
            "goal": goal,
            "skill": skill,
            "timeline": generate_timeline(skill_level, commitment_level),
            "steps": [
                {
                    "id": "step-1",
                    "title": f"Learn basic {skill} concepts",
                    "description": f"Start with the fundamentals of {skill} to build a solid foundation.",
                    "time_estimate": "2 weeks",
                    "difficulty": "Easy",
                    "resources": [
                        {
                            "title": f"Introduction to {skill}",
                            "url": f"https://example.com/intro-to-{skill.lower().replace(' ', '-')}",
                            "type": "article"
                        }
                    ],
                    "expected_outcome": f"Understanding of basic {skill} concepts",
                    "milestone_id": "milestone-1"
                }
            ]
        }


# Example usage of the agent (only runs when script is directly executed)
if __name__ == "__main__":
    goal = "I want to learn piano to play my favorite songs"
    skill = "piano"
    skill_level = {"current": "None", "target": "Intermediate"}
    commitment_level = "Moderate"
    
    plan = generate_steps(goal, skill, skill_level, commitment_level)
    print(json.dumps(plan, indent=2))