import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Stories from './pages/Stories';
import SubmitStory from './pages/SubmitStory';
import StoryDetail from './pages/StoryDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chat from './pages/Chat';

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/stories" element={<Stories />} />
            <Route path="/stories/:id" element={<StoryDetail />} />
            <Route path="/submit" element={<SubmitStory />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>&copy; 2026 StoriesOfUs. Empowering voices, inspiring change.</p>
        </footer>
      </div>
    </AuthProvider>
  );
}

export default App;

