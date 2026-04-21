import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle, signOut } from '../firebase';

export default function Navbar() {
  const { currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/30 border-b border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Brand Identity / Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
              VibeCheck ✨
            </Link>
          </div>

          {/* Desktop Navigation Navigation */}
          <div className="hidden md:flex flex-1 items-center justify-end space-x-6">
            {currentUser ? (
              <>
                <Link to="/history" className="text-gray-800 hover:text-purple-600 font-medium transition-colors">
                  History
                </Link>
                
                <div className="flex items-center space-x-3 pl-4 border-l border-white/50">
                  <span className="text-sm font-medium text-gray-800 hidden lg:block">
                    {currentUser.displayName}
                  </span>
                  <img 
                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName}&background=random`} 
                    alt="User Avatar" 
                    className="h-9 w-9 rounded-full ring-2 ring-purple-300 shadow-sm"
                  />
                  <button 
                    onClick={signOut}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-white/50 hover:bg-white/80 text-purple-700 transition-all duration-200 border border-white/30 shadow-sm hover:shadow-md"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="flex items-center px-5 py-2.5 text-sm font-medium rounded-full text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Sign in with Google
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 hover:text-purple-600 hover:bg-white/40 focus:outline-none transition-colors"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/60 backdrop-blur-xl border-t border-white/40">
          <div className="px-4 pt-2 pb-5 space-y-3 shadow-inner">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3 py-3 border-b border-white/50">
                  <img 
                    src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName}&background=random`} 
                    alt="User Avatar" 
                    className="h-10 w-10 rounded-full ring-2 ring-purple-300"
                  />
                  <div>
                    <div className="text-base font-medium text-gray-800">{currentUser.displayName}</div>
                    <div className="text-sm text-gray-500">{currentUser.email}</div>
                  </div>
                </div>
                <Link 
                  to="/history" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-xl text-base font-medium text-gray-800 hover:text-purple-600 hover:bg-white/60 transition-colors"
                >
                  History
                </Link>
                <button 
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-xl text-base font-medium text-purple-700 hover:bg-white/60 transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button 
                onClick={() => {
                  signInWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center px-4 py-3 mt-2 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-md"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
