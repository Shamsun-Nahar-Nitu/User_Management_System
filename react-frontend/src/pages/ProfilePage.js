import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';

const FIELDS = [
  { name: 'full_name', label: 'Full Name' },
  { name: 'address', label: 'Address' },
  { name: 'designation', label: 'Designation' },
  { name: 'organization', label: 'Organization' },
  { name: 'mobile_number', label: 'Mobile Number' },
  { name: 'working_language', label: 'Working Language' },
];

export default function ProfilePage() {
  const { profile, loadProfile } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ success: '', error: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState(
    FIELDS.reduce((acc, { name }) => ({ ...acc, [name]: profile?.[name] || '' }), {})
  );

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ success: '', error: '' });

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (file) formData.append('profile_picture', file);

      await api.put('/users/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await loadProfile();
      setStatus({ success: 'Profile updated successfully.', error: '' });
    } catch (err) {
      setStatus({ success: '', error: err.response?.data?.detail || 'Update failed.' });
    } finally {
      setLoading(false);
    }
  };

  const avatarSrc = preview || (profile?.profile_picture ? `${BACKEND_URL}${profile.profile_picture}` : null);

  return (
    <section className="card">
      <h2>Edit Profile</h2>
      <button type="button" onClick={() => navigate('/profile')} className="secondary" style={{ marginBottom: 16 }}>
        ← Back to Overview
      </button>

      {status.success && <p className="success">{status.success}</p>}
      {status.error && <p className="error">{status.error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          {avatarSrc ? (
            <img src={avatarSrc} alt="Preview" style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: 70, height: 70, borderRadius: '50%', background: '#e5e7eb', display: 'grid', placeItems: 'center', fontSize: 12 }}>
              No Photo
            </div>
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {FIELDS.map(({ name, label }) => (
          <label key={name}>
            {label}
            <input type="text" name={name} value={form[name]} onChange={handleChange} />
          </label>
        ))}

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Update profile'}
        </button>
      </form>
    </section>
  );
}