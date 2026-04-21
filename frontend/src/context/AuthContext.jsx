import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

// Create the Context
const AuthContext = createContext();

// Create a custom hook to use the context easily
export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If auth is null (Firebase not configured), just skip and render the app
        if (!auth) {
            setLoading(false);
            return;
        }

        // Listen to Auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-pink-50">
                    <p className="text-2xl font-black text-pink-400 animate-pulse">
                        ✨ loading vibecheck...
                    </p>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};
