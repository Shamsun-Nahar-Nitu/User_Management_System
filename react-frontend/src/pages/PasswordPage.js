import React from 'react';

export default function PasswordPage({ passwordForm, setPasswordForm, handlePasswordChange, loading, onBack }) {
  return (
    <section className="card">
      <div style={{ marginBottom: 12 }}>
        <button type="button" onClick={onBack} className="secondary">
          ← Back
        </button>
      </div>
      <h2>Change Password</h2>
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
