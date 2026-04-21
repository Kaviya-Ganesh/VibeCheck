<![CDATA[# VibeCheck ✨

> *"Your vibe is your digital signature."*

**VibeCheck** is a full-stack AI-powered mood board and playlist generator. Describe how you feel, and VibeCheck uses Google's Gemini AI to analyze your mood, generate aesthetic tags, create a unique AI-generated mood board image, and suggest a Spotify playlist — all in seconds.

🌐 **Live Demo**: [https://vibecheck-bb61f.web.app](https://vibecheck-bb61f.web.app)

---

## 📸 Screenshots

| Home Page | Result Page |
|-----------|-------------|
| Big bold typography with glassmorphism input card | AI-generated mood board with aesthetic tags and Spotify integration |

---

## ✨ Features

- 🎨 **AI-Powered Vibe Analysis** — Google Gemini analyzes your mood description and extracts aesthetic tags (e.g., *cottagecore*, *dark academia*, *golden hour*, *neon*)
- 🖼️ **AI-Generated Mood Board** — Unique images generated via Pollinations.ai based on your vibe tags
- 🎵 **Spotify Integration** — Automatically generates a Spotify search query matching your mood
- 🔐 **Google Authentication** — Sign in with Google to save and revisit your vibes
- 💾 **Vibe Archive** — Save your favorite vibes to Firestore and browse your history
- 📱 **Fully Responsive** — Premium glassmorphism UI that looks stunning on desktop and mobile
- ⚡ **Resilient Design** — Graceful loading states, error handling, and retry mechanisms

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **React Router v7** | Client-side routing |
| **Axios** | HTTP client for API calls |
| **Firebase Auth** | Google sign-in authentication |
| **Firebase Hosting** | Frontend deployment |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | Python web framework |
| **Google Gemini API** | AI mood analysis (REST API) |
| **Pollinations.ai** | AI image generation (no API key needed) |
| **Firebase Admin SDK** | Firestore database operations |
| **Uvicorn** | ASGI server |
| **Docker** | Containerized deployment |
| **Render** | Backend hosting (free tier) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                      │
│              Firebase Hosting (Static)                   │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐             │
│  │  Home    │  │  Result  │  │  History  │             │
│  │  Page    │  │  Page    │  │  Page     │             │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘             │
│       │              │              │                    │
│       ▼              ▼              ▼                    │
│  ┌──────────────────────────────────────┐               │
│  │     AuthContext (Firebase Auth)      │               │
│  └──────────────────────────────────────┘               │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS (Axios)
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   BACKEND (FastAPI)                      │
│                  Render (Docker)                         │
│                                                         │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────┐     │
│  │ POST /vibe │  │POST /save   │  │GET /history  │     │
│  └─────┬──────┘  └──────┬──────┘  └───────┬──────┘     │
│        │                │                 │              │
│   ┌────▼────┐     ┌─────▼──────┐   ┌─────▼──────┐     │
│   │ Gemini  │     │ Firestore  │   │ Firestore  │     │
│   │  API    │     │  (save)    │   │  (query)   │     │
│   └────┬────┘     └────────────┘   └────────────┘     │
│        │                                                │
│   ┌────▼──────────┐  ┌──────────────┐                  │
│   │Pollinations.ai│  │Spotify Search│                  │
│   │ (Image Gen)   │  │  (URL Build) │                  │
│   └───────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
VibeCheck/
├── backend/
│   ├── main.py                 # FastAPI routes & CORS config
│   ├── gemini.py               # Gemini REST API integration
│   ├── image.py                # Pollinations.ai URL builder
│   ├── spotify.py              # Spotify search URL builder
│   ├── firestore_client.py     # Firebase Admin Firestore operations
│   ├── models.py               # Pydantic request/response models
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Docker config for Render
│   └── .env                    # Environment variables (gitignored)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx      # Glassmorphism navigation bar
│   │   │   ├── MoodBoard.jsx   # AI image display with loading/retry
│   │   │   ├── LoadingState.jsx # Fullscreen loading overlay
│   │   │   └── VibeCard.jsx    # History card with modal preview
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth state provider
│   │   ├── pages/
│   │   │   ├── Home.jsx        # Main input page with hero section
│   │   │   ├── Result.jsx      # Vibe results with tags & image
│   │   │   └── History.jsx     # Saved vibes archive grid
│   │   ├── firebase.js         # Firebase client configuration
│   │   ├── App.jsx             # Router & layout shell
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Tailwind v4 imports & animations
│   ├── index.html              # HTML template with DM Sans font
│   ├── firebase.json           # Firebase Hosting config
│   ├── postcss.config.js       # PostCSS with @tailwindcss/postcss
│   ├── .env                    # Frontend env variables (gitignored)
│   └── package.json
│
├── firestore.rules             # Firestore security rules
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **Python** 3.11+
- **Firebase Project** with Authentication and Firestore enabled
- **Google AI Studio** API key for Gemini

### 1. Clone the Repository

```bash
git clone https://github.com/Kaviya-Ganesh/VibeCheck.git
cd VibeCheck
```

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo GEMINI_API_KEY=your_gemini_api_key_here > .env
echo GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json >> .env
```

> **Note**: Place your Firebase `serviceAccountKey.json` in the `backend/` directory. You can download it from [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service Accounts → Generate New Private Key.

```bash
# Run the backend
uvicorn main:app --reload --port 8080
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file with your Firebase config
```

Create `frontend/.env`:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_BACKEND_URL=http://localhost:8080
```

```bash
# Run the frontend
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🌐 Deployment

### Backend → Render

1. Push code to GitHub
2. Create a new **Web Service** on [Render](https://render.com)
3. Connect your GitHub repo, set root directory to `backend/`
4. Set environment to **Docker**
5. Add environment variables:
   - `GEMINI_API_KEY` — Your Google AI Studio API key
   - `FIREBASE_CREDENTIALS_JSON` — Base64-encoded `serviceAccountKey.json`

   To encode your service account key:
   ```powershell
   [Convert]::ToBase64String([System.IO.File]::ReadAllBytes("backend/serviceAccountKey.json"))
   ```

### Frontend → Firebase Hosting

```bash
cd frontend
npm run build
npx firebase-tools deploy --only hosting
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check — shows if Gemini & Firebase are configured |
| `GET` | `/debug/vibe` | Debug endpoint — tests Gemini with a sample prompt |
| `POST` | `/vibe` | Analyze mood text → returns tags, image URL, Spotify link |
| `POST` | `/vibe/save` | Save a vibe to Firestore for the authenticated user |
| `GET` | `/vibe/history/{user_id}` | Fetch all saved vibes for a user |

### Example Request

```bash
curl -X POST https://vibecheck-api-c1rc.onrender.com/vibe \
  -H "Content-Type: application/json" \
  -d '{"text": "sunset on a rooftop with jazz music", "user_id": "anonymous"}'
```

### Example Response

```json
{
  "tags": ["golden hour", "jazz", "rooftop", "warm", "nostalgic"],
  "spotify_query": "https://open.spotify.com/search/rooftop%20jazz%20sunset%20vibes",
  "image_url": "https://image.pollinations.ai/prompt/golden%20hour%20jazz%20rooftop%20warm%20nostalgic%20aesthetic%20mood%20board%20soft%20dreamy?width=600&height=600&nologo=true&seed=42",
  "vibe_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "created_at": "2026-04-21T17:00:00+00:00"
}
```

---

## 🎨 Design Philosophy

VibeCheck follows a **premium, editorial design** language:

- **Typography**: DM Sans with extra-bold weights and wide letter-spacing for a high-fashion feel
- **Layout**: Glassmorphism cards with `backdrop-blur` and soft white overlays
- **Colors**: Soft pastel mesh gradients (pink, lavender, sky blue) with high-contrast black buttons
- **Animations**: Fade-in-up entrances, hover scale transforms, and pulsing loading states
- **Micro-interactions**: Glowing card auras on hover, button lifts on hover, shimmer effects

---

## 🔒 Security

- **Firestore Rules**: Enforce `user_id` ownership — users can only read/write their own vibes
- **Environment Variables**: All API keys and credentials are stored as environment variables, never in source code
- **`.gitignore`**: Sensitive files (`serviceAccountKey.json`, `.env`) are excluded from version control
- **CORS**: Configured to allow cross-origin requests from the frontend domain

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank white screen | Check browser console (F12). Usually means Firebase config is empty in `.env` |
| Same tags every time | Gemini API key isn't set on Render. Check `/health` endpoint |
| Image not loading | Pollinations.ai may be under heavy load. Wait or click "try again" |
| Archive shows empty | Firestore composite index may be needed. Backend sorts in Python to avoid this |
| Backend slow first request | Render free tier sleeps after inactivity. First request takes ~30s to spin up |

---

## 📜 License

This project is built for educational and demonstration purposes.

---

## 👩‍💻 Author

**Kaviya Ganesh**

- GitHub: [@Kaviya-Ganesh](https://github.com/Kaviya-Ganesh)

---

<p align="center">
  Made with ✨ vibes and ☕ caffeine
</p>
]]>
