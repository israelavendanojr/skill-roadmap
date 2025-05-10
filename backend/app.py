from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import json
from typing import Dict, List, Any
import wikipediaapi
from serpapi import GoogleSearch

# Import agent
from agent import generate_steps
from config import Config

load_dotenv()
REACT_APP_PORT = os.getenv('REACT_APP_PORT', 5050)

app = Flask(__name__)
CORS(app)

# Initialize APIs
wiki = wikipediaapi.Wikipedia(
    language='en',
    extract_format=wikipediaapi.ExtractFormat.WIKI,
    user_agent='skill-roadmap-app/1.0 (contact@example.com)'
)

# Initialize SerpAPI
serp_api_key = os.getenv('SERP_API_KEY')

COMMITMENT_MAP = {
    "casual": "No rush",
    "dedicated": "Dedicated",
    "intensive": "Intensive",
    "moderate": "Moderate"
}

def capitalize_level(level):
    if not level:
        return level
    return level[0].upper() + level[1:].lower()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

@app.route('/api/wiki/page/<title>', methods=['GET'])
def get_wikipedia_page(title):
    """
    Get Wikipedia page content by title
    """
    page = wiki.page(title)
    if page.exists():
        return jsonify({
            'title': page.title,
            'summary': page.summary,
            'text': page.text,
            'url': page.fullurl
        })
    else:
        return jsonify({"error": "Page not found"}), 404

@app.route('/api/wiki/search', methods=['GET'])
def search_wikipedia():
    """
    Search Wikipedia for a given query
    """
    query = request.args.get('query', '')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400
    
    search_results = wiki.opensearch(query)
    return jsonify({
        'results': [
            {
                'title': result[0],
                'summary': result[1],
                'url': result[2]
            }
            for result in search_results
        ]
    })

@app.route('/api/serp/search', methods=['GET'])
def search_serp():
    """
    Search using SerpAPI
    """
    query = request.args.get('query', '')
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    search_params = {
        "q": query,
        "api_key": serp_api_key,
        "num": 10  # Number of results to return
    }

    try:
        search = GoogleSearch(search_params)
        results = search.get_dict()
        
        # Extract relevant information from results
        organic_results = []
        if 'organic_results' in results:
            for result in results['organic_results']:
                organic_results.append({
                    'title': result.get('title', ''),
                    'link': result.get('link', ''),
                    'snippet': result.get('snippet', ''),
                    'position': result.get('position', None)
                })

        return jsonify({
            'query': query,
            'results': organic_results,
            'total_results': len(organic_results)
        })
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

# New endpoints for the Goal Planner
@app.route('/api/goal-planner/create-plan', methods=['POST'])
def create_learning_plan():
    print('received from front')
    try:
        data = request.json
        skill = data.get('skill', '')
        goal_reason = data.get('goalReason', '')
        full_goal = f"I want to learn {skill} to {goal_reason}"
        commitment = COMMITMENT_MAP.get(data['commitment'].lower(), data['commitment'])
        formatted_input = {
            'goal': full_goal,
            'skill': skill,
            'skill_level': {
                'current': capitalize_level(data['currentLevel']),
                'target': capitalize_level(data['targetLevel'])
            },
            'commitment_level': commitment
        }
        learning_plan = generate_steps(**formatted_input)
        if isinstance(learning_plan, dict) and 'steps' in learning_plan:
            return jsonify(learning_plan['steps'])
        elif isinstance(learning_plan, list):
            return jsonify(learning_plan)
        else:
            return jsonify({"error": "Could not generate steps"}), 500
    except Exception as e:
        print(f"Error creating learning plan: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/goal-planner/validate-inputs', methods=['POST'])
def validate_inputs():
    """
    Validate user inputs before creating a full plan
    """
    try:
        data = request.json
        
        # Define valid options
        valid_levels = Config.VALID_SKILL_LEVELS
        valid_commitments = Config.VALID_COMMITMENT_LEVELS
        
        # Validate inputs
        errors = []
        
        if 'currentLevel' not in data or data['currentLevel'] not in valid_levels:
            errors.append("Invalid current level")
        
        if 'targetLevel' not in data or data['targetLevel'] not in valid_levels:
            errors.append("Invalid target level")
            
        if 'commitment' not in data or data['commitment'] not in valid_commitments:
            errors.append("Invalid commitment level")
            
        if 'goal' not in data or not data['goal'].strip():
            errors.append("Goal is required")
            
        if 'skill' not in data or not data['skill'].strip():
            errors.append("Skill is required")
            
        # Check if target level is higher than current level
        if ('currentLevel' in data and 'targetLevel' in data and 
            valid_levels.index(data['currentLevel']) >= valid_levels.index(data['targetLevel'])):
            errors.append("Target level must be higher than current level")
        
        if errors:
            return jsonify({"valid": False, "errors": errors}), 400
        else:
            return jsonify({"valid": True})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Check if required API keys are present
    if not Config.GOOGLE_GENAI_API_KEY:
        print("WARNING: No Gemini API key found. The application will not function correctly without it.")
    
    port = int(REACT_APP_PORT) if REACT_APP_PORT else 5050
    app.run(debug=True, host='0.0.0.0', port=port)