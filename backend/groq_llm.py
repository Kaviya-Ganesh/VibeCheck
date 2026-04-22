import os
import json
import logging
import random
from groq import Groq

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Curated aesthetic pools to nudge variety in the prompt
_AESTHETIC_POOLS = [
    "cottagecore, dark academia, golden hour, y2k, ethereal",
    "vaporwave, liminal space, solarpunk, goblincore, dreamcore",
    "soft grunge, pastel goth, indie sleaze, old money, clean girl",
    "cyberpunk, witchcore, romantic academia, coastal grandmother, barbiecore",
    "dark romance, light academia, retro futurism, fairycore, normcore",
    "angelcore, weirdcore, coquette, mob wife, quiet luxury",
    "grunge revival, tropical noir, desert minimalism, urban decay, neon noir",
    "forest bathing, midnight drive, rainy window, sunlit meadow, stargazing",
]


def analyze_vibe(text: str) -> dict:
    """
    Analyzes the user's vibe description using Groq's LLM API
    and returns aesthetic tags and a Spotify search query.
    Uses llama-3.3-70b-versatile for creative, diverse outputs.
    """
    api_key = os.environ.get("GROQ_API_KEY")
    if not api_key:
        logger.error("GROQ_API_KEY environment variable is not set.")
        return _fallback_vibe("No API key")

    try:
        client = Groq(api_key=api_key)

        # Pick a random aesthetic pool to nudge the model toward variety
        sample_aesthetics = random.choice(_AESTHETIC_POOLS)

        prompt = (
            "You are a creative vibe curator with deep knowledge of internet aesthetics, "
            "subcultures, and music. Given a mood description, return ONLY a valid JSON "
            "object with exactly two fields:\n"
            "1. \"tags\": a list of 4-6 UNIQUE aesthetic mood words that precisely "
            "match the specific mood described. Be creative and specific — avoid generic "
            "tags. Consider aesthetics like: " + sample_aesthetics + " and many others. "
            "Each tag should feel hand-picked for THIS specific vibe.\n"
            "2. \"spotify_query\": a creative Spotify search string (artist, genre, or "
            "mood-based) that perfectly matches this exact vibe. Be specific — don't just "
            "say 'chill beats'.\n\n"
            "CRITICAL: Do NOT reuse the same tags for different moods. Each mood is unique "
            "and deserves a unique set of tags. Think deeply about what makes THIS mood "
            "special and different.\n\n"
            "Return only valid JSON. No explanation, no markdown, no code fences."
        )

        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": prompt,
                },
                {
                    "role": "user",
                    "content": f"Mood description: {text}",
                },
            ],
            model="llama-3.3-70b-versatile",
            temperature=1.2,
            max_completion_tokens=256,
            top_p=0.9,
        )

        response_text = chat_completion.choices[0].message.content.strip()

        logger.info(f"Groq raw response: {response_text[:200]}")

        # Remove markdown ticks if the model accidentally includes them
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
            logger.warning("Empty or invalid data format returned from Groq.")
            return _fallback_vibe("Empty response from model")

        logger.info(f"Groq analysis successful: tags={tags}")
        return {
            "tags": tags,
            "spotify_query": spotify_query,
        }

    except json.JSONDecodeError as e:
        logger.error(f"Failed to parse JSON from Groq: {e}")
        return _fallback_vibe(f"JSON parse error: {e}")
    except Exception as e:
        logger.error(f"Error calling Groq API: {e}")
        return _fallback_vibe(f"API error: {e}")


def _fallback_vibe(reason: str = "unknown") -> dict:
    """Provides safe fallback values for error handling."""
    logger.warning(f"Using fallback vibe. Reason: {reason}")
    return {
        "tags": ["lo-fi", "chill", "atmospheric", "relaxing"],
        "spotify_query": "lofi chill beats",
    }
