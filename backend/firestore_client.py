import os
import json
import base64
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

# Initialize Firebase Admin SDK.
# Supports three methods:
# 1. FIREBASE_CREDENTIALS_JSON env var (base64-encoded JSON - works on Render free tier)
# 2. GOOGLE_APPLICATION_CREDENTIALS env var (file path - works locally)
# 3. Default credentials (works on Google Cloud)
if not firebase_admin._apps:
    try:
        # Method 1: Base64-encoded service account JSON in environment variable
        creds_json = os.environ.get("FIREBASE_CREDENTIALS_JSON")
        if creds_json:
            creds_dict = json.loads(base64.b64decode(creds_json))
            cred = credentials.Certificate(creds_dict)
            firebase_admin.initialize_app(cred)
            logger.info("Firebase initialized from FIREBASE_CREDENTIALS_JSON env var.")
        # Method 2: File path via GOOGLE_APPLICATION_CREDENTIALS
        elif os.environ.get("GOOGLE_APPLICATION_CREDENTIALS"):
            firebase_admin.initialize_app()
            logger.info("Firebase initialized from GOOGLE_APPLICATION_CREDENTIALS file.")
        else:
            logger.warning("No Firebase credentials found. Firestore will not work.")
            firebase_admin.initialize_app()
    except Exception as e:
        logger.error(f"Firebase initialization failed: {e}")

db = None
try:
    db = firestore.client()
except Exception as e:
    logger.error(f"Could not create Firestore client: {e}")

def save_vibe(user_id: str, vibe_data: dict) -> str:
    """
    Saves a generated vibe to the 'vibes' Firestore collection.
    Returns the newly generated document ID.
    """
    if not db:
        raise Exception("Firestore is not initialized. Check your Firebase credentials.")
    
    collection_ref = db.collection("vibes")
    
    # Convert created_at to a proper type if it's a string
    created_at = vibe_data.get("created_at", datetime.now(timezone.utc))
    if isinstance(created_at, str):
        try:
            created_at = datetime.fromisoformat(created_at.replace("Z", "+00:00"))
        except:
            created_at = datetime.now(timezone.utc)
    
    # Prepare the payload with all required fields
    payload = {
        "user_id": user_id,
        "tags": vibe_data.get("tags", []),
        "spotify_query": vibe_data.get("spotify_query", ""),
        "image_url": vibe_data.get("image_url", ""),
        "created_at": created_at
    }
    
    # Firestore auto-generates the document ID when using add()
    _, doc_ref = collection_ref.add(payload)
    
    return doc_ref.id

def get_user_vibes(user_id: str) -> list:
    """
    Fetches all vibes for a matching user_id.
    Orders them by created_at descending.
    """
    if not db:
        raise Exception("Firestore is not initialized. Check your Firebase credentials.")
    
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
        # Convert Firestore Timestamp to ISO string for JSON serialization
        if hasattr(vibe_dict.get("created_at"), "isoformat"):
            vibe_dict["created_at"] = vibe_dict["created_at"].isoformat()
        vibes_list.append(vibe_dict)
        
    return vibes_list
