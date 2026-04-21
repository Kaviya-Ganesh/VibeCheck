import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MoodBoard from '../components/MoodBoard';
import { signInWithGoogle } from '../firebase';

// Helper array to give tags distinct pastel colors
const pastelStyles = [
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-rose-100 text-rose-700 border-rose-200',
];

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const vibe = location.state?.vibe;

  // Protect against users manually navigating to /result without data
  if (!vibe) {
    return <Navigate to="/" replace />;
  }

  const { tags, image_url, spotify_query, created_at, vibe_id } = vibe;

  const handleSave = async () => {
    if (!currentUser) return;
    
    setSaving(true);
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
      
      await axios.post(`${backendUrl}/vibe/save`, {
        vibe_id: vibe_id,
        tags: tags,
        image_url: image_url,
        spotify_query: spotify_query,
        created_at: created_at,
        user_id: currentUser.uid
      });
      
      setSaved(true);
    } catch (error) {
      console.error("Failed to save vibe:", error);
      alert("Failed to save vibe. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 md:p-8 overflow-hidden">
      
      {/* Fallback solid background in case image loads slowly */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-pink-50/80 to-purple-100/80"></div>

      {/* Massive blurred background of the moodboard image itself */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110 opacity-40 blur-3xl"
        style={{ backgroundImage: `url(${image_url})` }}
      ></div>
      
      {/* Main Glassmorphism Presentation Card */}
      <div className="relative z-10 w-full max-w-2xl bg-white/50 backdrop-blur-2xl rounded-[3rem] p-6 md:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/60 animate-fade-in-up flex flex-col space-y-8">
        
        {/* Pastel Tag Badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {tags && tags.map((tag, index) => {
            const colorClass = pastelStyles[index % pastelStyles.length];
            return (
              <span 
                key={index} 
                className={`px-5 py-2 rounded-full text-sm font-bold border shadow-sm ${colorClass} uppercase tracking-wider`}
              >
                {tag}
              </span>
            );
          })}
        </div>

        {/* Central Graphic */}
        <div>
          <MoodBoard image_url={image_url} />
        </div>

        {/* Music Embed/Button */}
        <div className="flex justify-center -mt-2">
          <a
            href={spotify_query}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 px-8 py-4 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold tracking-wide transition-all hover:scale-105 hover:-translate-y-1 shadow-[0_0_20px_rgba(29,185,84,0.4)]"
          >
            {/* Spotify SVG Icon */}
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.539-1.26.24-3.24-1.98-8.159-2.58-11.94-1.44-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.36.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.32 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.42z"/>
            </svg>
            <span>Listen on Spotify</span>
          </a>
        </div>

        <hr className="border-white/50" />

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-4 font-bold text-purple-700 bg-white/60 hover:bg-white border border-white/80 rounded-full transition-colors shadow-sm hover:shadow"
          >
            Check another vibe 🔄
          </button>

          {currentUser ? (
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`w-full sm:w-auto px-8 py-4 font-bold text-white rounded-full shadow-lg transition-all ${
                saved 
                  ? 'bg-green-500 cursor-default shadow-none' 
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:-translate-y-1'
              } disabled:opacity-50 disabled:transform-none`}
            >
              {saving ? 'Saving...' : saved ? 'Saved! ✨' : 'Save this vibe 💾'}
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="w-full sm:w-auto px-8 py-4 font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 border-2 border-pink-200 rounded-full transition-colors shadow-[0_4px_14px_0_rgba(244,114,182,0.39)]"
            >
              sign in to save 🌸
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
