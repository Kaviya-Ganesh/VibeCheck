import React, { useState } from 'react';

export default function MoodBoard({ image_url }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative group w-full max-w-md mx-auto animate-fade-in-up">
      {/* Dreamy glow effect behind the image wrapper */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-80 transition duration-1000 group-hover:duration-200 ${isLoaded ? 'block' : 'hidden'}`}></div>
      
      {/* Card Wrapper */}
      <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-2 border-white/60">
        
        {/* Loading Skeleton */}
        {!isLoaded && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm animate-pulse">
            <div className="w-16 h-16 border-4 border-pink-300 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-400 font-medium tracking-widest text-sm uppercase">manifesting</p>
          </div>
        )}

        {/* The generated image */}
        {image_url ? (
          <img
            src={image_url}
            alt="Generated Aesthetic Mood Board"
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
            No image available
          </div>
        )}
      </div>
    </div>
  );
}
