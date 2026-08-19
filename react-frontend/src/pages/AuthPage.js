import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function AuthPage() {
  const { login } = useAuth();

  // Tab & UI status
  const [isLoginTab, setIsLoginTab] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form & saved profiles state
  const [recentUsers, setRecentUsers] = useState([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', full_name: '', password: '' });

  // Load saved profiles on page load
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('recent_users') || '[]');
    setRecentUsers(saved);
  }, []);

  // Helper functions
  const clearAlerts = () => { setError(''); setSuccess(''); };

  const switchTab = (toLogin) => {
    setIsLoginTab(toLogin);
    clearAlerts();
  };

  // Autofill BOTH username and password
  const autofillUser = (user) => {
    setLoginForm({ username: user.username, password: user.password || '' });
  };

  const removeUser = (e, username) => {
    e.stopPropagation();
    const updated = recentUsers.filter((u) => u.username !== username);
    setRecentUsers(updated);
    localStorage.setItem('recent_users', JSON.stringify(updated));
  };

  // Submit Handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearAlerts();
    try {
      await login(loginForm);

      // Save/update profile with latest credentials in LocalStorage
      const updated = [
        { username: loginForm.username, password: loginForm.password },
        ...recentUsers.filter((u) => u.username !== loginForm.username),
      ];
      setRecentUsers(updated);
      localStorage.setItem('recent_users', JSON.stringify(updated));
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    clearAlerts();
    try {
      await api.post('/auth/register/', registerForm);
      setSuccess('Registration successful! Please log in.');
      setRegisterForm({ username: '', email: '', full_name: '', password: '' });
      setIsLoginTab(true);
    } catch (err) {
      const data = err.response?.data;
      const key = data && Object.keys(data)[0];
      const msg = key ? (Array.isArray(data[key]) ? data[key][0] : data[key]) : 'Registration failed.';
      setError(key ? `${key}: ${msg}` : msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Status Alerts */}
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      {/* Tab Buttons */}
      <div className="auth-switcher">
        <button type="button" className={`switch ${isLoginTab ? 'active' : ''}`} onClick={() => switchTab(true)}>
          Login
        </button>
        <button type="button" className={`switch ${!isLoginTab ? 'active' : ''}`} onClick={() => switchTab(false)}>
          Register
        </button>
      </div>

      <div className="grid single-column">
        {isLoginTab ? (
          <section className="card">
            <h2>Login</h2>

            {/* Autofill Profile Chips */}
            {recentUsers.length > 0 && (
              <div className="recent-users-section">
                <p className="recent-users-label">Login:</p>
                <div className="recent-users-list">
                  {recentUsers.map((user) => (
                    <div key={user.username} className="recent-user-chip" onClick={() => autofillUser(user)}>
                      <span>👤 {user.username}</span>
                      <button type="button" className="recent-user-remove" onClick={(e) => removeUser(e, user.username)}>
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <label>
                Username
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? 'Please wait...' : 'Log in'}
              </button>
            </form>
          </section>
        ) : (
          <section className="card">
            <h2>Register</h2>
            {/* Register Form */}
            <form onSubmit={handleRegister}>
              <label>
                Username
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  required
                />
              </label>
              <label>
                Full Name
                <input
                  type="text"
                  value={registerForm.full_name}
                  onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  minLength={8}
                  required
                />
              </label>
              <button type="submit" disabled={loading}>
                {loading ? 'Please wait...' : 'Register'}
              </button>
            </form>
          </section>
        )}
      </div>
    </div>
  );
}