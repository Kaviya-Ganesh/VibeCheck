import urllib.parse
from typing import List

def generate_mood_image(tags: List[str]) -> str:
    """
    Constructs a Pollinations.ai image URL based on aesthetic tags.
    No API key is needed; the API generates images synchronously based on the encoded URL content.
    """
    # Join tags with a space
    base_prompt = " ".join(tags)
    
    # Append styling keywords to ensure a consistent, aesthetic output
    full_prompt = f"{base_prompt} aesthetic mood board soft dreamy"
    
    # URL encode the entire string to be valid within a URL path
    encoded_prompt = urllib.parse.quote(full_prompt)
    
    # Construct the final Pollinations URL
    url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=600&height=600&nologo=true"
    
    return url
