import os
import json
import logging
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def analyze_vibe(text: str) -> dict:
    """
    Analyzes the user's vibe description using the Gemini API and returns
    aesthetic tags and a Spotify search query.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY environment variable is not set.")
        return _fallback_vibe()

    try:
        genai.configure(api_key=api_key)
        
        # Using gemini-1.5-flash as the fast and capable model 
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = (
            "You are a vibe analyzer. Given a mood description, return "
            "ONLY a JSON object with two fields:\n"
            "1. tags: a list of 4-6 aesthetic mood words "
            "(examples: cottagecore, dark academia, golden hour, "
            "y2k, ethereal, cozy, melancholic, neon, soft girl, vintage)\n"
            "2. spotify_query: a Spotify search string that matches this vibe\n"
            "Return only valid JSON, no explanation, no markdown."
        )
        
        full_text = f"{prompt}\n\nMood description: {text}"
        
        response = model.generate_content(full_text)
        response_text = response.text.strip()
        
        # Remove markdown ticks if Gemini accidentally includes them
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        elif response_text.startswith("```"):
            response_text = response_text[3:]
            
        if response_text.endswith("```"):
            response_text = response_text[:-3]
            
        response_text = response_text.strip()
            
        data = json.loads(response_text)
        
        tags = data.get("tags", [])
        spotify_query = data.get("spotify_query", "")
        
        # Validate that we got actual data
        if not isinstance(tags, list) or len(tags) == 0 or not spotify_query:
            logger.warning("Empty or invalid data format returned from Gemini, using fallback.")
            return _fallback_vibe()
            
        return {
            "tags": tags,
            "spotify_query": spotify_query
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON response from Gemini: {e}. Response was: {response_text}")
        return _fallback_vibe()
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return _fallback_vibe()

def _fallback_vibe() -> dict:
    """Provides safe fallback values for error handling."""
    return {
        "tags": ["lo-fi", "chill", "atmospheric", "relaxing"],
        "spotify_query": "lofi chill beats"
    }
