import urllib.parse

def build_spotify_embed(query: str) -> str:
    """
    Constructs a Spotify search URL using the given query string.
    The query is URL encoded safely before insertion.
    """
    encoded_query = urllib.parse.quote(query)
    url = f"https://open.spotify.com/search/{encoded_query}"
    return url
