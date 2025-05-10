import requests
import json

url = "http://localhost:3001/api/goal-planner/create-plan"

data = {
    "skill": "piano",
    "goalReason": "play my favorite songs",
    "currentLevel": "None",
    "targetLevel": "Expert",
    "commitment": "Moderate"
}

response = requests.post(url, json=data)

print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    print(json.dumps(response.json(), indent=2))
else:
    print(f"Error: {response.text}")