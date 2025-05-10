from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import os
import wikipediaapi
from serpapi import GoogleSearch

load_dotenv()
REACT_APP_PORT = os.getenv('REACT_APP_PORT')

app = Flask(__name__)
CORS(app)

# Initialize APIs
wiki = wikipediaapi.Wikipedia(
    language='en',
    extract_format=wikipediaapi.ExtractFormat.WIKI
)

# Initialize SerpAPI
serp_api_key = os.getenv('SERP_API_KEY')

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