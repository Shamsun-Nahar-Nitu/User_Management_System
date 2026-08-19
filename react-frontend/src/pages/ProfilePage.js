import React from 'react';

export default function ProfilePage({ profile, profileForm, setProfileForm, handleProfileUpdate, handleLogout, loading, onBack }) {
  return (
    <section className="card">
      <h2>Profile</h2>
      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={onBack} className="secondary">
          ← Back
        </button>
      </div>
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
      <button type="button" className="secondary" onClick={handleLogout} disabled={loading}>
        Log out
      </button>
    </section>
  );
}
