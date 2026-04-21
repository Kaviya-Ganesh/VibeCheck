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
        return _fallback_vibe("No API key")

    try:
        genai.configure(api_key=api_key)
        
        # Try multiple model names for compatibility
        model = None
        model_names = [
            'gemini-2.0-flash',
            'gemini-1.5-flash',
            'gemini-1.5-flash-latest',
            'gemini-pro',
        ]
        
        last_error = None
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name)
                # Quick test to verify the model works
                logger.info(f"Trying model: {model_name}")
                break
            except Exception as e:
                last_error = e
                logger.warning(f"Model {model_name} not available: {e}")
                continue
        
        if model is None:
            logger.error(f"No Gemini model available. Last error: {last_error}")
            return _fallback_vibe(f"No model available: {last_error}")
        
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
            logger.warning("Empty or invalid data format returned from Gemini, using fallback.")
            return _fallback_vibe("Empty response from model")
            
        logger.info(f"Gemini analysis successful: tags={tags}")
        return {
            "tags": tags,
            "spotify_query": spotify_query
        }
        
    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON response from Gemini: {e}. Response was: {response_text}")
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
