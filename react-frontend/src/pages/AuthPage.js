import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function AuthPage() {
  const { login } = useAuth();
  const [page, setPage] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    full_name: '',
    password: '',
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await login(loginForm);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/auth/register/', registerForm);
      setSuccess('Registration successful! You can now log in.');
      setRegisterForm({ username: '', email: '', full_name: '', password: '' });
      setPage('login');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstKey = Object.keys(data)[0];
        const msg = Array.isArray(data[firstKey]) ? data[firstKey][0] : data[firstKey];
        setError(`${firstKey}: ${msg}`);
      } else {
        setError('Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {success && <p className="success">{success}</p>}
      {error && <p className="error">{error}</p>}

      <div className="auth-switcher">
        <button
          type="button"
          className={`switch ${page === 'login' ? 'active' : ''}`}
          onClick={() => { setPage('login'); setError(''); setSuccess(''); }}
        >
          Login
        </button>
        <button
          type="button"
          className={`switch ${page === 'register' ? 'active' : ''}`}
          onClick={() => { setPage('register'); setError(''); setSuccess(''); }}
        >
          Register
        </button>
      </div>

      <div className="grid single-column">
        {page === 'login' ? (
          <section className="card">
            <h2>Login</h2>
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