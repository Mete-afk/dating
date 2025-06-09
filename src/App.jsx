
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import ProfilePage from '@/pages/ProfilePage';
import MatchesPage from '@/pages/MatchesPage';
import SettingsPage from '@/pages/SettingsPage';
import ChatPage from '@/pages/ChatPage';
import OnboardingPage from '@/pages/OnboardingPage';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"><div className="spinner"></div></div>;
  }
  return currentUser ? children : <Navigate to="/onboarding" />;
}

function AppContent() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"><div className="spinner"></div></div>;
  }

  return (
    <Routes>
      <Route path="/onboarding" element={currentUser ? <Navigate to="/" /> : <OnboardingPage />} />
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="matches" element={<MatchesPage />} />
        <Route path="chat/:chatId" element={<ChatPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={currentUser ? "/" : "/onboarding"} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
