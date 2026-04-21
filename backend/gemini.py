import os
import json
import logging
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

def analyze_vibe(text: str) -> dict:
    """
    Analyzes the user's vibe description using the Gemini REST API directly
    and returns aesthetic tags and a Spotify search query.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        logger.error("GEMINI_API_KEY environment variable is not set.")
        return _fallback_vibe("No API key")

    try:
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
        
        payload = {
            "contents": [
                {
                    "parts": [
                        {"text": full_text}
                    ]
                }
            ],
            "generationConfig": {
                "temperature": 1.0,
                "maxOutputTokens": 256
            }
        }
        
        response = requests.post(
            f"{GEMINI_API_URL}?key={api_key}",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"Gemini API returned status {response.status_code}: {response.text[:500]}")
            return _fallback_vibe(f"API status {response.status_code}")
        
        result = response.json()
        
        # Extract the text from the response
        response_text = result["candidates"][0]["content"]["parts"][0]["text"].strip()
        
        logger.info(f"Gemini raw response: {response_text[:200]}")
        
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
            logger.warning("Empty or invalid data format returned from Gemini.")
            return _fallback_vibe("Empty response from model")
            
        logger.info(f"Gemini analysis successful: tags={tags}")
        return {
            "tags": tags,
            "spotify_query": spotify_query
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON from Gemini: {e}")
        return _fallback_vibe(f"JSON parse error: {e}")
    except Exception as e:
        logger.error(f"Error calling Gemini API: {e}")
        return _fallback_vibe(f"API error: {e}")

def _fallback_vibe(reason: str = "unknown") -> dict:
    """Provides safe fallback values for error handling."""
    logger.warning(f"Using fallback vibe. Reason: {reason}")
    return {
        "tags": ["lo-fi", "chill", "atmospheric", "relaxing"],
        "spotify_query": "lofi chill beats"
    }
