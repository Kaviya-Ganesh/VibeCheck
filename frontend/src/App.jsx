import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';

export default function App() {
  return (
    // Wrap the entire app in the AuthContext to provide global user state
    <AuthProvider>
      <Router>
        {/* Set up the global layout shell */}
        <div className="flex flex-col min-h-screen">
          
          {/* Navbar renders persistently above all nested routes */}
          <Navbar />
          
          {/* Main content routing block */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/result" element={<Result />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
          
        </div>
      </Router>
    </AuthProvider>
  );
}
