import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './pages/AuthPage';
import ProfileOverview from './pages/ProfileOverview';
import ProfilePage from './pages/ProfilePage';
import PasswordPage from './pages/PasswordPage';
import './App.css';

const ProtectedRoute = ({ children }) => {
  const { accessToken, loading } = useAuth();
  if (loading) return <p>Loading session...</p>;
  if (!accessToken) return <Navigate to="/login" replace />;
  return children;
};

function AppRoutes() {
  const { accessToken } = useAuth();

  return (
    <main className="App">
      <h1>User Management App</h1>
      <Routes>
        <Route 
          path="/login" 
          element={accessToken ? <Navigate to="/profile" replace /> : <AuthPage />} 
        />
        <Route 
          path="/profile" 
          element={<ProtectedRoute><ProfileOverview /></ProtectedRoute>} 
        />
        <Route 
          path="/profile-edit" 
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} 
        />
        <Route 
          path="/change-password" 
          element={<ProtectedRoute><PasswordPage /></ProtectedRoute>} 
        />
        <Route path="*" element={<Navigate to={accessToken ? "/profile" : "/login"} replace />} />
      </Routes>
    </main>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}