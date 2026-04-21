import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/LoadingState';

export default function Home() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      // Use environment variable for backend URL, default to local port 8080 if not set.
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      const userId = currentUser ? currentUser.uid : 'anonymous';
      
      const response = await axios.post(`${backendUrl}/vibe`, {
        text: text,
        user_id: userId
      });
      
      // Pass the resulting payload to the result page implicitly through React Router's state.
      navigate('/result', { state: { vibe: response.data } });
    } catch (error) {
      console.error("Error analyzing vibe:", error);
      alert("Oops! Could not check your vibe. Ensure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-pink-100 via-purple-50 to-white flex items-center justify-center p-4">
      
      {/* Centered Glassmorphism Card */}
      {loading && <LoadingState />}
      <div className="w-full max-w-3xl bg-white/40 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-14 shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/60 animate-fade-in-up">
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-8 relative z-10">
            <div className="text-center space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 pb-2">
                what's your vibe right now? ✨
              </h1>
              <p className="text-gray-500 text-lg md:text-xl font-medium">
                describe your mood, a feeling, a moment, anything
              </p>
            </div>
            
            <textarea
              className="w-full h-44 text-lg md:text-xl p-6 bg-white/70 border-2 border-white/80 rounded-3xl focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-300 transition-all resize-none shadow-inner text-gray-700 placeholder-gray-400"
              placeholder="I'm feeling like sitting by a warm fireplace with hot cocoa while it snows outside..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              required
            />
            
            <div className="flex flex-col items-center pt-4 space-y-5">
              <button
                type="submit"
                disabled={!text.trim() || loading}
                className="group relative w-full sm:w-auto px-12 py-4 font-bold text-xl text-white rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-[0_0_25px_rgba(236,72,153,0.4)] hover:shadow-[0_0_35px_rgba(168,85,247,0.6)] transform transition-all hover:-translate-y-1 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Check My Vibe 🎵
                <div className="absolute inset-0 h-full w-full rounded-full border-2 border-white/20 group-hover:border-white/40 transition-colors"></div>
              </button>

              {!currentUser && (
                <div className="text-pink-400 font-medium text-sm md:text-base animate-pulse">
                  sign in to save your vibes 🌸
                </div>
              )}
            </div>
          </form>
      </div>

    </div>
  );
}
