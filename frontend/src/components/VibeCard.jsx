import React, { useState } from 'react';

// Reusing pastelStyles to keep aesthetic exactly consistent across the app
const pastelStyles = [
  'bg-pink-100 text-pink-700 border-pink-200',
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-rose-100 text-rose-700 border-rose-200',
];

export default function VibeCard({ image_url, tags, created_at, spotify_query }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Format the ISO UTC date nicely for the UI
  const formattedDate = new Date(created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <>
      {/* Clickable Card Thumbnail */}
      <div 
        onClick={() => setIsModalOpen(true)}
        className="group relative flex flex-col bg-white/70 backdrop-blur-md rounded-[2rem] p-4 shadow-sm hover:shadow-[0_15px_30px_-5px_rgba(236,72,153,0.15)] border-2 border-pink-50 hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
      >
        <div className="w-full aspect-square overflow-hidden rounded-2xl mb-4 bg-gray-50">
          <img 
            src={image_url} 
            alt="Vibe Thumbnail" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
            loading="lazy"
          />
        </div>

           {/* Render only up to 3 tags dynamically mapped to pastel colors so the card fits cleanly */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tags && tags.slice(0, 3).map((tag, i) => (
            <span key={i} className={`px-2.5 py-1 text-xs font-bold uppercase tracking-wider border rounded-full ${pastelStyles[i % pastelStyles.length]}`}>
              {tag}
            </span>
          ))}
          {tags && tags.length > 3 && (
            <span className="px-2.5 py-1 text-[10px] font-bold text-gray-500 bg-gray-100 border border-gray-200 rounded-full flex items-center">
              +{tags.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto text-xs font-bold tracking-widest text-gray-400/80 uppercase">
          {formattedDate}
        </div>
      </div>

      {/* Modal Popup Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-white/40 backdrop-blur-xl animate-fade-in-up">
          
          {/* Clickaway backdrop listener */}
          <div className="absolute inset-0" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative z-10 w-full max-w-lg bg-white/80 backdrop-blur-2xl rounded-[3rem] p-6 md:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.15)] border border-white/60 flex flex-col space-y-6">
            
            {/* Close Button X */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-pink-500 focus:outline-none transition-colors bg-white/50 w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm"
            >
              ×
            </button>
            
            {/* Full High-res image in Modal */}
            <div className="w-full aspect-square overflow-hidden rounded-[2.5rem] shadow-xl border-4 border-white">
              <img src={image_url} alt="Full Mood Board" className="w-full h-full object-cover" />
            </div>
            
            {/* Full Tag List */}
            <div className="flex flex-wrap justify-center gap-2">
              {tags && tags.map((tag, i) => (
                <span key={i} className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full border shadow-sm ${pastelStyles[i % pastelStyles.length]}`}>
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Spotify Button within Modal */}
            <div className="flex justify-center pt-2">
              <a
                href={spotify_query}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-8 py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-white font-bold tracking-wide transition-all shadow-md hover:shadow-[0_5px_20px_rgba(29,185,84,0.3)] hover:scale-105"
              >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.84.539-1.26.24-3.24-1.98-8.159-2.58-11.94-1.44-.48.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.36.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.6.18-1.2.72-1.38 4.26-1.32 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.54-1.02.72-1.56.42z"/>
                  </svg>
                <span>Listen on Spotify</span>
              </a>
            </div>

            <div className="text-center text-xs font-bold tracking-widest uppercase text-gray-300 pt-3 border-t border-gray-100">
               Created on {formattedDate}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}
