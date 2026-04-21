import os
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone

# Initialize Firebase Admin SDK.
# The initialize_app() function automatically detects the GOOGLE_APPLICATION_CREDENTIALS
# environment variable pointing to serviceAccountKey.json
if not firebase_admin._apps:
    firebase_admin.initialize_app()

db = firestore.client()

def save_vibe(user_id: str, vibe_data: dict) -> str:
    """
    Saves a generated vibe to the 'vibes' Firestore collection.
    Returns the newly generated document ID.
    """
    collection_ref = db.collection("vibes")
    
    # Prepare the payload with all required fields
    payload = {
        "user_id": user_id,
        "tags": vibe_data.get("tags", []),
        "spotify_query": vibe_data.get("spotify_query", ""),
        "image_url": vibe_data.get("image_url", ""),
        "created_at": vibe_data.get("created_at", datetime.now(timezone.utc))
    }
    
    # Firestore auto-generates the document ID when using add()
    _, doc_ref = collection_ref.add(payload)
    
    return doc_ref.id

def get_user_vibes(user_id: str) -> list:
    """
    Fetches all vibes for a matching user_id.
    Orders them by created_at descending.
    """
    # Query vibes collection matching user_id and sort by creation time
    docs = (
        db.collection("vibes")
        .where(filter=firestore.FieldFilter("user_id", "==", user_id))
        .order_by("created_at", direction=firestore.Query.DESCENDING)
        .stream()
    )
    
    vibes_list = []
    for doc in docs:
        vibe_dict = doc.to_dict()
        # Include the auto-generated vibe_id from the document ID
        vibe_dict["vibe_id"] = doc.id
        vibes_list.append(vibe_dict)
        
    return vibes_list
