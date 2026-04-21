import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import VibeCard from '../components/VibeCard';
import { signInWithGoogle } from '../firebase';

export default function History() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [vibes, setVibes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Break early if no user exists so we can cleanly render empty state
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';
        const response = await axios.get(`${backendUrl}/vibe/history/${currentUser.uid}`);
        setVibes(response.data || []);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [currentUser]);

  // View: Not Logged In
  if (!currentUser) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-pink-100 animate-fade-in-up">
          <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-8 leading-snug">
            sign in to see your vibe history 🌙
          </p>
          <button 
            onClick={signInWithGoogle}
            className="w-full px-6 py-4 font-bold text-white rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  // View: Loading Shell
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 pb-2 mb-8 animate-pulse">
          your vibe archive 🎀
        </h1>
        {/* 2 Cols Mobile, 3 Cols Desktop Layout */}
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[1, 2, 3, 4, 5, 6].map((skel) => (
            <div key={skel} className="w-full bg-white/50 backdrop-blur-md border 2 border-white rounded-[2rem] p-4 flex flex-col justify-between animate-pulse shadow-sm min-h-[250px]">
               <div className="w-full aspect-square bg-gray-200/50 rounded-2xl"></div>
               <div className="flex gap-2 mt-4">
                  <div className="h-5 w-14 bg-gray-200/60 rounded-full"></div>
                  <div className="h-5 w-16 bg-gray-200/60 rounded-full"></div>
               </div>
               <div className="h-3 w-16 bg-gray-200/60 rounded-full mt-6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View: Logged In, Data Empty
  if (vibes.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] w-full flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="w-full max-w-lg bg-white/60 backdrop-blur-2xl rounded-[2.5rem] p-10 text-center shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-pink-100 animate-fade-in-up">
          <p className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 mb-8 leading-snug">
            no vibes saved yet... go check your vibe! ✨
          </p>
          <button 
            onClick={() => navigate('/')}
            className="px-10 py-4 font-bold text-white rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Check your vibe
          </button>
        </div>
      </div>
    );
  }

  // View: Grid Loaded
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-gradient-to-br from-pink-50 via-white to-purple-50 p-4 md:p-12">
      <div className="max-w-7xl mx-auto animate-fade-in-up">
        
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 pb-2 mb-8 md:mb-12">
          your vibe archive 🎀
        </h1>
        
        {/* Responsive Grid System: 2 columns mostly, expanding to 3 on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {vibes.map((v) => (
            <VibeCard 
              key={v.vibe_id}
              image_url={v.image_url}
              tags={v.tags}
              created_at={v.created_at}
              spotify_query={v.spotify_query}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
