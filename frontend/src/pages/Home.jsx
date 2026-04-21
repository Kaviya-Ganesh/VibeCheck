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
      console.error("DEBUG - Vibe Error:", error);
      console.log("Current Backend URL:", import.meta.env.VITE_BACKEND_URL);
      alert("Oops! Could not check your vibe. Ensure the backend is running.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-[#fdf2f8] bg-[radial-gradient(circle_at_0%_0%,#fdf2f8_0%,#f0f9ff_50%,#faf5ff_100%)] flex flex-col items-center justify-start p-6 overflow-hidden">
      
      {loading && <LoadingState />}

      {/* Hero Section with Big Cute Quote */}
      <header className="max-w-4xl text-center pt-12 pb-16 animate-fade-in-up">
        <h2 className="text-pink-400 font-bold uppercase tracking-[0.3em] mb-4 text-sm md:text-base">
          ✨ find your aesthetic ✨
        </h2>
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
          "Your vibe is your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400">digital signature</span>."
        </h1>
        <p className="text-gray-500 text-xl md:text-2xl font-medium max-w-2xl mx-auto">
          tell us how your soul feels today, and we'll paint it in music and art.
        </p>
      </header>
      
      {/* Centered Glassmorphism Card */}
      <div className="w-full max-w-4xl group relative z-10 animate-fade-in-up transition-transform duration-500 hover:scale-[1.01]">
        
        {/* Glowing aura behind the card */}
        <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative bg-white/70 backdrop-blur-3xl rounded-[3rem] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-10">
            
            <div className="space-y-4">
              <label className="text-lg font-bold text-gray-400 ml-2 uppercase tracking-widest">
                mood description
              </label>
              <textarea
                className="w-full h-44 text-2xl md:text-3xl p-8 bg-white/50 border-0 rounded-[2.5rem] focus:outline-none focus:ring-4 focus:ring-pink-200 transition-all resize-none shadow-inner text-gray-800 placeholder-gray-300 font-medium leading-relaxed"
                placeholder="I'm feeling like a rainy midnight in a neon city..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <div className="flex flex-col items-center space-y-6">
              <button
                type="submit"
                disabled={!text.trim() || loading}
                className="group relative w-full sm:w-auto px-16 py-6 font-black text-2xl text-white rounded-full bg-black hover:bg-gray-900 shadow-[0_15px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transform transition-all hover:-translate-y-2 active:scale-95 focus:outline-none disabled:opacity-30"
              >
                Let's Vibe Check 🚀
              </button>

              {!currentUser && (
                <div className="px-6 py-2 rounded-full bg-pink-100 text-pink-600 font-bold text-sm tracking-wide border border-pink-200 animate-pulse">
                  sign in to save your vibes 🌸
                </div>
              )}
            </div>
          </form>
        </div>
      </div>

    </div>
  );
}
