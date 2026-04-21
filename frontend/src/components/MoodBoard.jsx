import React, { useState, useEffect } from 'react';

export default function MoodBoard({ image_url }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSlow, setIsSlow] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Show "taking longer than usual" message after 10 seconds
  useEffect(() => {
    if (isLoaded || hasError) return;
    const timer = setTimeout(() => setIsSlow(true), 10000);
    return () => clearTimeout(timer);
  }, [isLoaded, hasError, retryCount]);

  const handleRetry = () => {
    setIsLoaded(false);
    setIsSlow(false);
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  // Append a cache-busting param on retry
  const finalUrl = image_url 
    ? (retryCount > 0 ? `${image_url}&retry=${retryCount}` : image_url)
    : null;

  return (
    <div className="relative group w-full max-w-md mx-auto animate-fade-in-up">
      {/* Dreamy glow effect behind the image wrapper */}
      <div className={`absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400 rounded-[2rem] blur-xl opacity-60 group-hover:opacity-80 transition duration-1000 group-hover:duration-200 ${isLoaded ? 'block' : 'hidden'}`}></div>
      
      {/* Card Wrapper */}
      <div className="relative aspect-square w-full rounded-[2rem] overflow-hidden bg-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border-2 border-white/60">
        
        {/* Loading Skeleton */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-pink-300 border-t-purple-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-purple-400 font-medium tracking-widest text-sm uppercase animate-pulse">
              {isSlow ? 'still painting...' : 'manifesting'}
            </p>
            {isSlow && (
              <p className="mt-2 text-gray-400 text-xs text-center px-8">
                pollinations.ai is generating your image — this can take up to 30 seconds during peak traffic ✨
              </p>
            )}
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
            <p className="text-gray-500 font-bold text-lg mb-2">couldn't load image 😢</p>
            <p className="text-gray-400 text-sm mb-4 text-center px-6">pollinations.ai might be busy right now</p>
            <button 
              onClick={handleRetry}
              className="px-8 py-3 bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all transform hover:-translate-y-1 active:scale-95"
            >
              try again ✨
            </button>
          </div>
        )}

        {/* The generated image */}
        {finalUrl ? (
          <img
            key={retryCount}
            src={finalUrl}
            alt="Generated Aesthetic Mood Board"
            onLoad={() => { setIsLoaded(true); setIsSlow(false); }}
            onError={() => setHasError(true)}
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
