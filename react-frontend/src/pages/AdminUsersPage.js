import React from 'react';

export default function AdminUsersPage({ adminUsers, loadAdminUsers, loading }) {
  return (
    <section className="card">
      <h2>Admin Users</h2>
      <p>Use this only if your account has admin permission.</p>
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
