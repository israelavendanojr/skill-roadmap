import json
import os
import requests
import wikipediaapi
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from serpapi import GoogleSearch

# Initialize APIs
wiki = wikipediaapi.Wikipedia(
    language='en',
    extract_format=wikipediaapi.ExtractFormat.WIKI,
    user_agent='skill-roadmap-app/1.0 (contact@example.com)'
)

# Initialize SerpAPI
serp_api_key = os.getenv('SERP_API_KEY')
youtube_api_key = os.getenv('YOUTUBE_API_KEY')

def search_wikipedia(query: str, max_results: int = 3) -> List[Dict[str, str]]:
    """
    Search Wikipedia for information related to a learning topic
    
    Args:
        query: Search query
        max_results: Maximum number of results to return
        
    Returns:
        List of dictionaries with title, summary, and URL
    """
    try:
        # The wikipediaapi package doesn't actually have an opensearch method
        # Let's use a direct approach instead
        
        # First, try to get a page directly with the query
        page = wiki.page(query)
        results = []
        
        if page.exists():
            results.append({
                'title': page.title,
                'summary': page.summary[:500] + "..." if len(page.summary) > 500 else page.summary,
                'url': page.fullurl
            })
            
            # Try to get some related pages via links
            # Get the first few links from the page
            links = list(page.links.values())[:max_results-1]
            for link_page in links:
                if link_page.exists():
                    results.append({
                        'title': link_page.title,
                        'summary': link_page.summary[:500] + "..." if len(link_page.summary) > 500 else link_page.summary,
                        'url': link_page.fullurl
                    })
        
        # If no results found, return empty list
        if not results:
            # Try alternative search by adding "learning" to the query
            alt_page = wiki.page(f"{query} learning")
            if alt_page.exists():
                results.append({
                    'title': alt_page.title,
                    'summary': alt_page.summary[:500] + "..." if len(alt_page.summary) > 500 else alt_page.summary,
                    'url': alt_page.fullurl
                })
                
        return results
    except Exception as e:
        print(f"Wikipedia search error: {str(e)}")
        # Return an empty list - the agent should handle this appropriately
        return []

def search_web(query: str, max_results: int = 5) -> List[Dict[str, str]]:
    """
    Search the web using SerpAPI for learning resources
    
    Args:
        query: Search query
        max_results: Maximum number of results to return
        
    Returns:
        List of dictionaries with title, snippet, and URL
    """
    try:
        if not serp_api_key:
            raise ValueError("SERP API key is not set")
            
        search_params = {
            "q": query,
            "api_key": serp_api_key,
            "num": max_results
        }
        
        search = GoogleSearch(search_params)
        results = search.get_dict()
        
        organic_results = []
        if 'organic_results' in results:
            for result in results['organic_results'][:max_results]:
                organic_results.append({
                    'title': result.get('title', ''),
                    'snippet': result.get('snippet', ''),
                    'link': result.get('link', '')
                })
        
        return organic_results
    except Exception as e:
        print(f"SERP search error: {str(e)}")
        # Return an empty list - the agent should handle this appropriately
        return []

def search_youtube(query: str, max_results: int = 3) -> List[Dict[str, str]]:
    """
    Search YouTube for educational videos related to a topic
    
    Args:
        query: Search query
        max_results: Maximum number of results to return
        
    Returns:
        List of dictionaries with title, description, URL, and thumbnail
    """
    try:
        if not youtube_api_key:
            raise ValueError("YouTube API key is not set")
            
        # YouTube Data API v3 endpoint
        url = f"https://www.googleapis.com/youtube/v3/search"
        
        params = {
            'part': 'snippet',
            'q': query + " tutorial",
            'type': 'video',
            'maxResults': max_results,
            'key': youtube_api_key,
            'relevanceLanguage': 'en',
            'videoEmbeddable': 'true'
        }
        
        response = requests.get(url, params=params)
        results = response.json()
        
        videos = []
        if 'items' in results:
            for item in results['items']:
                video_id = item['id']['videoId']
                videos.append({
                    'title': item['snippet']['title'],
                    'description': item['snippet']['description'],
                    'url': f"https://www.youtube.com/watch?v={video_id}",
                    'thumbnail': item['snippet']['thumbnails']['medium']['url']
                })
        
        return videos
    except Exception as e:
        print(f"YouTube search error: {str(e)}")
        # Return an empty list - the agent should handle this appropriately
        return []

def generate_timeline(
    skill_level: Dict[str, str],
    commitment_level: str
) -> Dict[str, Any]:
    """
    Generate a realistic timeline based on skill levels and commitment
    
    Args:
        skill_level: Dict with 'current' and 'target' levels
        commitment_level: Level of commitment (e.g., 'No rush', 'Moderate')
        
    Returns:
        Dictionary with estimated timeline and milestone structure
    """
    # Define level progression and typical timeframes (in weeks)
    level_map = {
        "None": 0,
        "Beginner": 1,
        "Intermediate": 2, 
        "Advanced": 3,
        "Expert": 4
    }
    
    # Time multipliers based on commitment level
    commitment_multipliers = {
        "No rush": 2.0,
        "Moderate": 1.0,
        "Dedicated": 0.7,
        "Intensive": 0.5
    }
    
    # Base time needed for each level transition (in weeks)
    level_transition_time = {
        (0, 1): 8,  # None to Beginner
        (1, 2): 12, # Beginner to Intermediate
        (2, 3): 16, # Intermediate to Advanced
        (3, 4): 24  # Advanced to Expert
    }
    
    current_level_value = level_map[skill_level["current"]]
    target_level_value = level_map[skill_level["target"]]
    
    # Calculate total weeks needed
    total_weeks = 0
    milestones = []
    
    current = current_level_value
    while current < target_level_value:
        transition = (current, current + 1)
        weeks_needed = level_transition_time[transition] * commitment_multipliers[commitment_level]
        
        # Round to nearest whole week
        weeks_needed = round(weeks_needed)
        
        # Create milestone
        from_level = list(level_map.keys())[current]
        to_level = list(level_map.keys())[current + 1]
        
        # Add some description to the milestone
        descriptions = {
            (0, 1): f"Build a foundation in {from_level} level concepts and start developing basic skills",
            (1, 2): f"Expand on {from_level} knowledge and develop more advanced techniques",
            (2, 3): f"Master complex concepts and develop specialized skills",
            (3, 4): f"Refine expertise and develop professional-level mastery"
        }
        
        milestone = {
            "id": f"milestone-{current+1}",
            "name": f"{from_level} to {to_level}",
            "description": descriptions.get(transition, f"Progress from {from_level} to {to_level} level"),
            "duration_weeks": weeks_needed,
            "start_week": total_weeks,
            "end_week": total_weeks + weeks_needed
        }
        
        milestones.append(milestone)
        total_weeks += weeks_needed
        current += 1
    
    # Calculate approximate dates
    start_date = datetime.now()
    end_date = start_date + timedelta(weeks=total_weeks)
    
    # Format dates as strings
    start_date_str = start_date.strftime("%Y-%m-%d")
    end_date_str = end_date.strftime("%Y-%m-%d")
    
    return {
        "estimated_weeks": total_weeks,
        "start_date": start_date_str,
        "end_date": end_date_str,
        "milestones": milestones
    }

def format_learning_plan(
    goal: str,
    skill: str,
    timeline: Dict[str, Any],
    steps: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Format the complete learning plan response
    
    Args:
        goal: User's goal statement
        skill: The skill to be learned
        timeline: Timeline information
        steps: List of action steps
        
    Returns:
        Formatted learning plan as a dictionary
    """
    # Define a minimum number of required steps
    MIN_REQUIRED_STEPS = 5
    
    # Add IDs to steps if they don't have them
    for i, step in enumerate(steps):
        if 'id' not in step:
            step['id'] = f"step-{i+1}"
        
        # Ensure each step has all required fields
        required_fields = [
            'title', 'description', 'time_estimate', 'difficulty', 
            'resources', 'expected_outcome', 'milestone_id'
        ]
        
        for field in required_fields:
            if field not in step:
                if field == 'resources':
                    step[field] = [
                        {
                            "title": f"Resource for {step.get('title', f'Step {i+1}')}",
                            "url": f"https://example.com/{skill.lower().replace(' ', '-')}/{i+1}",
                            "type": "article"
                        }
                    ]
                elif field == 'expected_outcome':
                    step[field] = f"Complete {step.get('title', f'Step {i+1}')}"
                elif field == 'time_estimate':
                    step[field] = "1 week"
                elif field == 'difficulty':
                    step[field] = "Medium"
                elif field == 'milestone_id':
                    step[field] = timeline["milestones"][0]["id"] if timeline["milestones"] else "milestone-1"
                else:
                    step[field] = f"Missing {field}"
    
    # If we don't have enough steps, create additional ones
    if len(steps) < MIN_REQUIRED_STEPS:
        print(f"Warning: Only {len(steps)} steps provided. Adding more to meet minimum of {MIN_REQUIRED_STEPS}.")
        
        # Template steps based on the skill
        if skill.lower() in ['piano', 'guitar', 'violin', 'drums', 'singing']:
            # Music-related templates
            templates = [
                {
                    "title": f"Learn basic {skill} theory",
                    "description": f"Understand the fundamental music theory concepts related to {skill}. This includes notes, scales, and basic chord progressions.",
                    "expected_outcome": f"Ability to read basic sheet music and understand foundational {skill} theory"
                },
                {
                    "title": f"Master proper technique and posture",
                    "description": f"Learn the correct posture and hand/body positioning for {skill}. Good technique is essential for preventing injuries and developing good habits.",
                    "expected_outcome": f"Proper form and technique when playing/practicing {skill}"
                },
                {
                    "title": f"Practice rhythm and timing exercises",
                    "description": f"Develop a strong sense of rhythm through dedicated timing exercises. Start with a metronome at slow tempos and gradually increase speed.",
                    "expected_outcome": f"Improved timing and rhythm skills on {skill}"
                },
                {
                    "title": f"Learn to play simple songs",
                    "description": f"Apply your skills by learning to play simple, popular songs on the {skill}. This helps build confidence and makes practice more enjoyable.",
                    "expected_outcome": f"Ability to play 3-5 simple songs on {skill}"
                },
                {
                    "title": f"Record and analyze your playing",
                    "description": f"Record yourself playing and critically analyze your performance. Identify areas for improvement and focus on specific techniques that need work.",
                    "expected_outcome": f"Self-awareness of strengths and weaknesses in {skill} playing"
                }
            ]
        elif skill.lower() in ['programming', 'coding', 'python', 'javascript', 'java', 'web development']:
            # Programming-related templates
            templates = [
                {
                    "title": f"Learn {skill} syntax and basic concepts",
                    "description": f"Master the fundamental syntax and concepts of {skill}. This includes variables, control structures, and basic data types.",
                    "expected_outcome": f"Understanding of basic {skill} syntax and concepts"
                },
                {
                    "title": f"Build simple projects with {skill}",
                    "description": f"Apply your knowledge by creating small projects. Start with guided tutorials and gradually increase complexity.",
                    "expected_outcome": f"Completion of 2-3 small projects using {skill}"
                },
                {
                    "title": f"Learn debugging techniques in {skill}",
                    "description": f"Develop skills to identify and fix errors in your {skill} code. Learn to use debugging tools and read error messages effectively.",
                    "expected_outcome": f"Ability to troubleshoot and resolve common errors in {skill}"
                },
                {
                    "title": f"Study best practices and code standards",
                    "description": f"Learn industry-standard practices for writing clean, maintainable {skill} code. Study code style guides and conventions.",
                    "expected_outcome": f"Writing code that follows best practices in {skill}"
                },
                {
                    "title": f"Contribute to open source {skill} projects",
                    "description": f"Start contributing to open source projects that use {skill}. This provides real-world experience and feedback from other developers.",
                    "expected_outcome": f"Successful contributions to at least one open source {skill} project"
                }
            ]
        elif skill.lower() in ['language', 'spanish', 'french', 'german', 'japanese', 'chinese', 'english']:
            # Language learning templates
            templates = [
                {
                    "title": f"Master basic {skill} vocabulary",
                    "description": f"Learn essential vocabulary for everyday conversations in {skill}. Focus on high-frequency words and practical phrases.",
                    "expected_outcome": f"Knowledge of 500-1000 common {skill} words"
                },
                {
                    "title": f"Practice {skill} pronunciation",
                    "description": f"Develop proper pronunciation skills in {skill}. Work with audio resources and practice speaking aloud regularly.",
                    "expected_outcome": f"Clear, understandable pronunciation of basic {skill} words and phrases"
                },
                {
                    "title": f"Study {skill} grammar fundamentals",
                    "description": f"Learn the basic grammar rules of {skill}. Understand sentence structure, verb conjugations, and other important grammatical concepts.",
                    "expected_outcome": f"Ability to form basic grammatically correct sentences in {skill}"
                },
                {
                    "title": f"Engage in basic {skill} conversations",
                    "description": f"Practice simple conversations in {skill} with language partners or tutors. Focus on everyday topics and practical situations.",
                    "expected_outcome": f"Ability to hold a 5-minute basic conversation in {skill}"
                },
                {
                    "title": f"Consume {skill} media",
                    "description": f"Listen to and read simple content in {skill}. Start with content designed for learners and gradually progress to authentic materials.",
                    "expected_outcome": f"Understanding of simple {skill} content without heavy reliance on translation"
                }
            ]
        else:
            # Generic templates for any skill
            templates = [
                {
                    "title": f"Learn {skill} fundamentals",
                    "description": f"Master the basic concepts and foundational knowledge of {skill}. This builds the groundwork for more advanced learning.",
                    "expected_outcome": f"Solid understanding of {skill} basics"
                },
                {
                    "title": f"Practice basic {skill} techniques",
                    "description": f"Develop proficiency in the fundamental techniques of {skill} through regular, focused practice sessions.",
                    "expected_outcome": f"Competence in basic {skill} techniques"
                },
                {
                    "title": f"Apply {skill} in simple projects",
                    "description": f"Use your developing {skill} knowledge in small projects or exercises. This helps reinforce learning through practical application.",
                    "expected_outcome": f"Completion of 2-3 simple {skill} projects"
                },
                {
                    "title": f"Study advanced {skill} concepts",
                    "description": f"Expand your knowledge by learning more complex aspects of {skill}. Build upon your foundational understanding.",
                    "expected_outcome": f"Understanding of intermediate {skill} concepts"
                },
                {
                    "title": f"Join a {skill} community",
                    "description": f"Connect with others who are learning or practicing {skill}. Share experiences, ask questions, and learn from others.",
                    "expected_outcome": f"Active participation in a {skill} community"
                }
            ]
        
        # Determine step difficulty progression
        difficulties = ["Easy", "Easy", "Medium", "Medium", "Hard"]
        
        # Determine appropriate milestone distribution
        if len(timeline["milestones"]) >= 2:
            # If we have at least 2 milestones, distribute steps between them
            milestone_distribution = []
            steps_per_milestone = MIN_REQUIRED_STEPS // len(timeline["milestones"])
            remaining_steps = MIN_REQUIRED_STEPS % len(timeline["milestones"])
            
            for i in range(len(timeline["milestones"])):
                count = steps_per_milestone + (1 if i < remaining_steps else 0)
                milestone_distribution.extend([timeline["milestones"][i]["id"]] * count)
        else:
            # If we have only 1 milestone, all steps go there
            milestone_distribution = [timeline["milestones"][0]["id"]] * MIN_REQUIRED_STEPS
        
        # Add new steps until we reach the minimum
        for i in range(len(steps), MIN_REQUIRED_STEPS):
            template_index = i % len(templates)
            template = templates[template_index]
            
            # Create time estimates that increase with difficulty
            time_estimates = {
                "Easy": ["1 day", "3 days", "1 week"],
                "Medium": ["1 week", "2 weeks", "3 weeks"],
                "Hard": ["3 weeks", "4 weeks", "5 weeks"]
            }
            
            difficulty = difficulties[min(i, len(difficulties) - 1)]
            time_estimate = time_estimates[difficulty][i % len(time_estimates[difficulty])]
            
            # Create the step
            milestone_id = milestone_distribution[i]
            
            new_step = {
                "id": f"step-{i+1}",
                "title": template["title"],
                "description": template["description"],
                "time_estimate": time_estimate,
                "difficulty": difficulty,
                "resources": [
                    {
                        "title": f"Resource for {template['title']}",
                        "url": f"https://example.com/{skill.lower().replace(' ', '-')}/{i+1}",
                        "type": "article"
                    },
                    {
                        "title": f"Video tutorial: {template['title']}",
                        "url": f"https://example.com/video/{skill.lower().replace(' ', '-')}/{i+1}",
                        "type": "video"
                    }
                ],
                "expected_outcome": template["expected_outcome"],
                "milestone_id": milestone_id
            }
            
            steps.append(new_step)
    
    # Create the final formatted response
    formatted_plan = {
        "goal": goal,
        "skill": skill,
        "timeline": timeline,
        "steps": steps
    }
    
    return formatted_plan