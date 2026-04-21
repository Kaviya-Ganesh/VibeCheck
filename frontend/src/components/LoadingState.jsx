import React, { useState, useEffect } from 'react';

const messages = [
  "reading your energy... ✨",
  "painting your mood board... 🎨",
  "finding your playlist... 🎵",
  "almost there... 🌸"
];

export default function LoadingState() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    // Cycle messages every 1.5 seconds (1500ms)
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/45 backdrop-blur-lg transition-opacity duration-500">
      
      {/* Animated Floating Sparkles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[15%] left-[20%] animate-float-slow text-pink-300 text-3xl">✨</div>
        <div className="absolute top-[65%] left-[85%] animate-float-fast text-purple-300 text-4xl">✨</div>
        <div className="absolute top-[80%] left-[25%] animate-float-medium text-pink-400 text-2xl">✨</div>
        <div className="absolute top-[25%] left-[75%] animate-float-slow text-purple-400 text-3xl animate-delay-300">✨</div>
        <div className="absolute top-[50%] left-[10%] animate-float-medium text-pink-200 text-2xl animate-delay-500">✨</div>
      </div>
      
      {/* Centered Loading Hub */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-12 p-8 animate-fade-in-up">
        
        {/* Glowing Orb */}
        <div className="relative flex justify-center items-center scale-125">
          <div className="absolute animate-ping inline-flex h-32 w-32 rounded-full bg-gradient-to-r from-pink-300 to-purple-300 opacity-60"></div>
          <div className="absolute animate-pulse inline-flex h-24 w-24 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 opacity-80 duration-1000"></div>
          <div className="relative inline-flex rounded-full h-20 w-20 bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.7)]">
            <span className="text-4xl animate-pulse">✨</span>
          </div>
        </div>
        
        {/* Dynamic Text */}
        <div className="h-10 flex items-center justify-center text-center">
           <p 
             key={messageIndex} 
             className="text-2xl md:text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 animate-pulse drop-shadow-sm transition-all duration-300"
           >
             {messages[messageIndex]}
           </p>
        </div>
        
      </div>
    </div>
  );
}
