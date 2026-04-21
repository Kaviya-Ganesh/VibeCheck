import uuid
from datetime import datetime, timezone
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Load .env file for local development
load_dotenv()

from models import VibeRequest, VibeResponse, SavedVibe
from gemini import analyze_vibe
from image import generate_mood_image
from spotify import build_spotify_embed
from firestore_client import save_vibe, get_user_vibes

app = FastAPI(title="VibeCheck API")

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Quick health check to verify the backend is running and configured."""
    import os
    return {
        "status": "ok",
        "gemini_configured": bool(os.environ.get("GEMINI_API_KEY")),
        "firebase_configured": bool(
            os.environ.get("FIREBASE_CREDENTIALS_JSON") or 
            os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")
        )
    }

@app.get("/debug/vibe")
async def debug_vibe():
    """Test endpoint to verify Gemini API is working. Visit in browser to check."""
    result = analyze_vibe("I feel like sitting in a cozy cafe on a rainy day")
    is_fallback = result.get("tags") == ["lo-fi", "chill", "atmospheric", "relaxing"]
    return {
        "result": result,
        "is_fallback": is_fallback,
        "note": "If is_fallback is true, Gemini API is not working. Check Render logs."
    }

@app.post("/vibe", response_model=VibeResponse)
async def generate_vibe(request: VibeRequest):
    """
    Takes user's text, uses Gemini to extract tags and Spotify query, 
    generates mood board image URL, and constructs Spotify URL.
    Returns the assembled VibeResponse without saving to Firestore.
    """
    try:
        # 1. Analyze text with Gemini
        ai_result = analyze_vibe(request.text)
        
        tags = ai_result.get("tags", [])
        raw_spotify_query = ai_result.get("spotify_query", "")
        
        # 2. Build Pollinations.ai Image URL
        image_url = generate_mood_image(tags)
        
        # 3. Build Spotify Embed URL
        spotify_url = build_spotify_embed(raw_spotify_query)
        
        # Return response
        return VibeResponse(
            tags=tags,
            spotify_query=spotify_url,
            image_url=image_url,
            vibe_id=str(uuid.uuid4()),  # Temporary ID for the current session
            created_at=datetime.now(timezone.utc)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate vibe: {str(e)}")

@app.post("/vibe/save")
async def save_user_vibe(request: SavedVibe):
    """
    Saves a generated vibe to Firestore. Expects VibeResponse fields + user_id.
    """
    vibe_data = {
        "tags": request.tags,
        "spotify_query": request.spotify_query,
        "image_url": request.image_url,
        "created_at": request.created_at
    }
    
    try:
        new_vibe_id = save_vibe(request.user_id, vibe_data)
        return {"vibe_id": new_vibe_id, "message": "Vibe successfully saved."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save vibe: {str(e)}")

@app.get("/vibe/history/{user_id}")
async def get_history(user_id: str):
    """
    Fetches the user's previously saved vibes from Firestore based on user_id.
    """
    try:
        vibes = get_user_vibes(user_id)
        return vibes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch history: {str(e)}")
