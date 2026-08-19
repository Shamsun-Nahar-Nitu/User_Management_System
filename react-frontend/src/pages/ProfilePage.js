import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { profile, loadProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [profileForm, setProfileForm] = useState({
    full_name: profile?.full_name || '',
    address: profile?.address || '',
    designation: profile?.designation || '',
    organization: profile?.organization || '',
    mobile_number: profile?.mobile_number || '',
    working_language: profile?.working_language || '',
  });

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      await api.put('/users/profile/', profileForm);
      await loadProfile();
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Profile</h2>
      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={() => navigate('/profile')} className="secondary">
          ← Back
        </button>
      </div>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
      {profile && (
        <p>
          Logged in as <strong>{profile.username}</strong> ({profile.email})
        </p>
      )}
      <form onSubmit={handleProfileUpdate}>
        <label>
          Full Name
          <input
            type="text"
            value={profileForm.full_name}
            onChange={(event) => setProfileForm({ ...profileForm, full_name: event.target.value })}
          />
        </label>
        <label>
          Address
          <input
            type="text"
            value={profileForm.address}
            onChange={(event) => setProfileForm({ ...profileForm, address: event.target.value })}
          />
        </label>
        <label>
          Designation
          <input
            type="text"
            value={profileForm.designation}
            onChange={(event) => setProfileForm({ ...profileForm, designation: event.target.value })}
          />
        </label>
        <label>
          Organization
          <input
            type="text"
            value={profileForm.organization}
            onChange={(event) => setProfileForm({ ...profileForm, organization: event.target.value })}
          />
        </label>
        <label>
          Mobile Number
          <input
            type="text"
            value={profileForm.mobile_number}
            onChange={(event) => setProfileForm({ ...profileForm, mobile_number: event.target.value })}
          />
        </label>
        <label>
          Working Language
          <input
            type="text"
            value={profileForm.working_language}
            onChange={(event) => setProfileForm({ ...profileForm, working_language: event.target.value })}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : 'Update profile'}
        </button>
      </form>
      <button type="button" className="secondary" onClick={logout} disabled={loading}>
        Log out
      </button>
    </section>
  );
}