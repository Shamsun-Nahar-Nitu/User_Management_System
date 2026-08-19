import React from 'react';

export default function ProfileOverview({ profile, onEditProfile, onChangePassword, onAdminUsers }) {
  return (
    <section className="card">
      <h2>Profile</h2>
      {profile ? (
        <div>
          <p>
            Logged in as <strong>{profile.username}</strong> ({profile.email})
          </p>
          <p>Full name: {profile.full_name || '—'}</p>
          <p>Designation: {profile.designation || '—'}</p>
          <p>Organization: {profile.organization || '—'}</p>
          <div style={{ marginTop: 12 }}>
            <button type="button" onClick={onEditProfile} className="primary">
              Edit profile
            </button>{' '}
            <button type="button" onClick={onChangePassword} className="secondary">
              Change password
            </button>{' '}
            <button type="button" onClick={onAdminUsers}>
              Admin users
            </button>
          </div>
        </div>
      ) : (
        <p>No profile loaded.</p>
      )}
    </section>
  );
}
