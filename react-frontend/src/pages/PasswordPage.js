import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function PasswordPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/change-password/', passwordForm);
      alert('Password changed. Please log in again.');
      await logout();
    } catch (err) {
      setError(err.response?.data?.detail || 'Password change failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={() => navigate('/profile')} className="secondary">
          ← Back
        </button>
      </div>
      <h2>Change Password</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handlePasswordChange}>
        <label>
          Old Password
          <input
            type="password"
            value={passwordForm.old_password}
            onChange={(event) => setPasswordForm({ ...passwordForm, old_password: event.target.value })}
            required
          />
        </label>
        <label>
          New Password
          <input
            type="password"
            value={passwordForm.new_password}
            onChange={(event) => setPasswordForm({ ...passwordForm, new_password: event.target.value })}
            minLength={8}
            required
          />
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={passwordForm.confirm_password}
            onChange={(event) => setPasswordForm({ ...passwordForm, confirm_password: event.target.value })}
            minLength={8}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : 'Change password'}
        </button>
      </form>
    </section>
  );
}