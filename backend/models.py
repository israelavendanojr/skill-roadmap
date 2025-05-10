from typing import Dict, List, Any, Optional
from dataclasses import dataclass
from datetime import datetime

@dataclass
class Resource:
    """Resource for a learning step"""
    title: str
    url: str
    type: str  # 'article', 'video', 'exercise', etc.
    description: Optional[str] = None

@dataclass
class Step:
    """Individual learning step"""
    id: str
    title: str
    description: str
    time_estimate: str  # e.g., "2 hours", "3 days"
    difficulty: str  # "Easy", "Medium", "Hard"
    resources: List[Resource]
    expected_outcome: str
    milestone_id: str
    completed: bool = False

@dataclass
class Milestone:
    """Learning milestone"""
    id: str
    name: str
    description: str
    duration_weeks: int
    start_week: int
    end_week: int
    steps: List[Step] = None

@dataclass
class Timeline:
    """Learning timeline"""
    estimated_weeks: int
    start_date: str
    end_date: str
    milestones: List[Milestone]

@dataclass
class LearningPlan:
    """Complete learning plan"""
    id: str
    goal: str
    skill: str
    timeline: Timeline
    created_at: str = datetime.now().isoformat()
    updated_at: str = datetime.now().isoformat()

# JSON schemas for validation
SKILL_LEVEL_SCHEMA = {
    "type": "object",
    "properties": {
        "current": {"type": "string", "enum": ["None", "Beginner", "Intermediate", "Advanced", "Expert"]},
        "target": {"type": "string", "enum": ["Beginner", "Intermediate", "Advanced", "Expert"]}
    },
    "required": ["current", "target"]
}

COMMITMENT_LEVEL_SCHEMA = {
    "type": "string",
    "enum": ["No rush", "Moderate", "Dedicated", "Intensive"]
}

CREATE_PLAN_SCHEMA = {
    "type": "object",
    "properties": {
        "goal": {"type": "string"},
        "skill": {"type": "string"},
        "currentLevel": {"type": "string", "enum": ["None", "Beginner", "Intermediate", "Advanced", "Expert"]},
        "targetLevel": {"type": "string", "enum": ["Beginner", "Intermediate", "Advanced", "Expert"]},
        "commitment": {"type": "string", "enum": ["No rush", "Moderate", "Dedicated", "Intensive"]}
    },
    "required": ["goal", "skill", "currentLevel", "targetLevel", "commitment"]
}