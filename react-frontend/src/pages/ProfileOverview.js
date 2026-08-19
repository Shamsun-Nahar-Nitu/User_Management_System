import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://127.0.0.1:8000';

export default function ProfileOverview() {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const getPictureUrl = (path) => {
    if (!path) return null;
    return path.startsWith('http') ? path : `${BACKEND_URL}${path}`;
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <h2>Profile Overview</h2>
      {profile ? (
        <div>
          {/* Side-by-side flex container */}
          <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '20px' }}>
            {/* Left Column: Profile Picture */}
            <div>
              {profile.profile_picture ? (
                <img
                  src={getPictureUrl(profile.profile_picture)}
                  alt={`${profile.username}'s profile`}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #cbd5e1'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: '#e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#6b7280',
                    fontSize: 14,
                    border: '2px solid #cbd5e1'
                  }}
                >
                  No Photo
                </div>
              )}
            </div>

            {/* Right Column: User Details */}
            <div style={{ flex: 1, minWidth: '220px' }}>
              <p style={{ margin: '0 0 8px' }}><strong>Username:</strong> {profile.username}</p>
              <p style={{ margin: '0 0 8px' }}><strong>Email:</strong> {profile.email}</p>
              <p style={{ margin: '0 0 8px' }}><strong>Full Name:</strong> {profile.full_name || '—'}</p>
              <p style={{ margin: '0 0 8px' }}><strong>Address:</strong> {profile.address || '—'}</p>
              <p style={{ margin: '0 0 8px' }}><strong>Designation:</strong> {profile.designation || '—'}</p>
              <p style={{ margin: '0 0 8px' }}><strong>Organization:</strong> {profile.organization || '—'}</p>
              <p style={{ margin: '0 0 8px' }}><strong>Mobile Number:</strong> {profile.mobile_number || '—'}</p>
              <p style={{ margin: '0 0 8px' }}><strong>Working Language:</strong> {profile.working_language || '—'}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 16 }}>
            <button type="button" onClick={() => navigate('/profile-edit')} className="primary">
              Edit profile
            </button>{' '}
            <button type="button" onClick={() => navigate('/change-password')} className="secondary">
              Change password
            </button>{' '}
            <button type="button" onClick={handleLogout} disabled={loading} className="secondary">
              {loading ? 'Logging out...' : 'Log out'}
            </button>
          </div>
        </div>
      ) : (
        <p>No profile loaded.</p>
      )}
    </section>
  );
}