import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadAdminUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/users/details');
      setAdminUsers(response.data.results || response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load admin users.');
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
      <h2>Admin Users</h2>
      <p>Use this only if your account has admin permission.</p>
      {error && <p className="error">{error}</p>}
      <button type="button" onClick={loadAdminUsers} disabled={loading}>
        {loading ? 'Please wait...' : 'Load users'}
      </button>
      <ul className="user-list">
        {adminUsers.map((user) => (
          <li key={user.id}>
            {user.username} - {user.email}
          </li>
        ))}
      </ul>
    </section>
  );
}