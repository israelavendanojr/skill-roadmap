import json
from dotenv import load_dotenv
import os
import requests
import google.generativeai as genai
from llama_index.core.agent import ReActAgent
from llama_index.core.tools import FunctionTool
from llama_index.llms.gemini import Gemini

# Load environment variables
load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GOOGLE_GENAI_API_KEY')
genai.configure(api_key=GEMINI_API_KEY)


def setup_react_agent():
    """
    Create and configure a ReActAgent with our tools.
    
    Returns:
        ReActAgent: Configured agent
    """
    # Create the Gemini LLM wrapper for llama_index
    llm = Gemini(
        api_key=GEMINI_API_KEY,
        model_name="gemini-1.5-pro",
        temperature=0.2
    )
    
    # # Create tools
    # find_places_tool = FunctionTool.from_defaults(
    #     name="find_places",
    #     description="Find places or activities based on location, interest, time, and date",
    #     fn=find_places
    # )

    # Define the system prompt as part of the agent's configuration
    system_prompt = """
    You are an event recommendation assistant.
    
    The user will provide their preferences as a JSON object containing location, interest, time, date, and radius.
    Use the `find_places` tool with these parameters to get recommendations.
    The `format_response` tool should always be the last tool used to ensure the output has the correct format.
    
    Return the final JSON response that includes the recommendations array.
    """
    
    # Create ReAct agent with our tools and LLM
    tools = []
    agent = ReActAgent.from_tools(
        tools,
        llm=llm,
        verbose=True,
        system_prompt=system_prompt  # Pass the system prompt during agent creation
    )
    
    return agent


agent = setup_react_agent()
response = agent.chat("Give me a list of hobbies to learn in my free time")
print(str(response))