# VibeCheck ✨

> **Your vibe is your digital signature.**

VibeCheck is a full-stack AI-powered mood board and playlist generator. Describe how you feel, and VibeCheck uses **Google Gemini AI** to analyze your mood, generate a unique AI mood board image, and suggest a matching Spotify playlist — all in seconds.

🌐 **Live App** → [vibecheck-bb61f.web.app](https://vibecheck-bb61f.web.app)

---

## ✨ Features

- 🎨 **AI Vibe Analysis** — Gemini AI extracts aesthetic tags like *cottagecore*, *golden hour*, *dark academia*
- 🖼️ **AI Mood Board** — Unique images generated in real-time via Pollinations.ai
- 🎵 **Spotify Match** — Auto-generates a Spotify search query for your vibe
- 🔐 **Google Sign-In** — OAuth 2.0 authentication via Firebase
- 💾 **Vibe Archive** — Save favorites to Cloud Firestore and browse your history
- 📱 **Responsive & Premium** — Glassmorphism UI with DM Sans typography
- ⚡ **Resilient** — Graceful loading, error handling, and retry mechanisms

---

## 🛠️ Tech Stack

**Frontend** — React 19 · Vite 8 · Tailwind CSS v4 · React Router · Axios · Firebase Auth · Firebase Hosting

**Backend** — Python 3.11 · FastAPI · Uvicorn · Pydantic · Docker · Render

**Cloud Services** — Firebase Hosting (CDN) · Firebase Auth (OAuth) · Cloud Firestore (NoSQL DB) · Gemini API (AI) · Pollinations.ai (Image Gen) · Render (Docker Hosting)

---

## 🏗️ How It Works

```
User types mood → Frontend sends POST to Backend API
                         ↓
              Backend calls Gemini AI (REST API)
              Gemini returns aesthetic tags + Spotify query
                         ↓
              Backend builds Pollinations.ai image URL
              Backend builds Spotify search URL
                         ↓
              Backend sends JSON response to Frontend
                         ↓
              Frontend displays mood board + tags + Spotify button
                         ↓
              User clicks "Archive" → saved to Cloud Firestore
```

---

## 📁 Project Structure

```
VibeCheck/
│
├── backend/
│   ├── main.py                  # FastAPI routes + CORS
│   ├── gemini.py                # Gemini REST API calls
│   ├── image.py                 # Pollinations.ai URL builder
│   ├── spotify.py               # Spotify search URL builder
│   ├── firestore_client.py      # Firestore CRUD operations
│   ├── models.py                # Pydantic models
│   ├── requirements.txt         # Python dependencies
│   └── Dockerfile               # Container config for Render
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, MoodBoard, LoadingState, VibeCard
│   │   ├── context/             # AuthContext (global auth state)
│   │   ├── pages/               # Home, Result, History
│   │   ├── firebase.js          # Firebase client config
│   │   ├── App.jsx              # Router + layout
│   │   └── index.css            # Tailwind v4 + custom animations
│   ├── index.html
│   ├── firebase.json            # Firebase Hosting config
│   └── postcss.config.js
│
├── firestore.rules              # Firestore security rules
└── README.md
```

---

## 🚀 Quick Start

### Backend

```bash
cd backend
python -m venv venv && venv\Scripts\activate
pip install -r requirements.txt
```

Create `backend/.env`:

```
GEMINI_API_KEY=your_key_here
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json
```

```bash
uvicorn main:app --reload --port 8080
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:8080
```

```bash
npm run dev
```

---

## 🌐 Deployment

**Frontend** → Firebase Hosting

```bash
cd frontend && npm run build && npx firebase-tools deploy --only hosting
```

**Backend** → Render (Docker)

Push to GitHub → Render auto-detects → Builds Docker image → Deploys container

Environment variables on Render:
- `GEMINI_API_KEY` — Google AI Studio API key
- `FIREBASE_CREDENTIALS_JSON` — Base64-encoded service account JSON

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET`  | `/health` | Health check (shows config status) |
| `POST` | `/vibe` | Analyze mood → returns tags, image, Spotify link |
| `POST` | `/vibe/save` | Save a vibe to Firestore |
| `GET`  | `/vibe/history/{user_id}` | Fetch saved vibes for a user |

**Example:**

```bash
curl -X POST https://vibecheck-api-c1rc.onrender.com/vibe \
  -H "Content-Type: application/json" \
  -d '{"text": "sunset on a rooftop with jazz", "user_id": "anon"}'
```

---

## 🔒 Security

- API keys stored as **environment variables**, never in source code
- `.gitignore` excludes `.env` and `serviceAccountKey.json`
- Firestore rules enforce **user-level data isolation**
- Firebase client keys are safe to expose — security is enforced server-side

---

## 🐛 Common Issues

| Problem | Fix |
|---------|-----|
| Blank white screen | Firebase keys missing in `frontend/.env` |
| Same tags every time | `GEMINI_API_KEY` not set on Render |
| Image won't load | Pollinations.ai is busy — click "try again" |
| Archive is empty | Backend redeploying — wait 2 min and retry |
| Slow first load | Render free tier cold start (~30s) |

---

## 👩‍💻 Author

**Kaviya Ganesh** — [@Kaviya-Ganesh](https://github.com/Kaviya-Ganesh)

---

<p align="center">Made with ✨ vibes and ☕ caffeine</p>
