from pydantic import BaseModel
from typing import List
from datetime import datetime

class VibeRequest(BaseModel):
    text: str
    user_id: str

class VibeResponse(BaseModel):
    tags: List[str]
    spotify_query: str
    image_url: str
    vibe_id: str
    created_at: datetime

class SavedVibe(VibeResponse):
    user_id: str
