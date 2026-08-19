import React from 'react';

export default function AuthPage({
  page,
  setPage,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  handleLogin,
  handleRegister,
  loading,
}) {
  return (
    <div>
      <div className="auth-switcher">
        <button
          type="button"
          className={page === 'login' ? 'switch active' : 'switch'}
          onClick={() => setPage('login')}
        >
          Login
        </button>
        <button
          type="button"
          className={page === 'register' ? 'switch active' : 'switch'}
          onClick={() => setPage('register')}
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
                  onChange={(event) => setLoginForm({ ...loginForm, username: event.target.value })}
                  required
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })}
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
                  onChange={(event) => setRegisterForm({ ...registerForm, username: event.target.value })}
                  required
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(event) => setRegisterForm({ ...registerForm, email: event.target.value })}
                  required
                />
              </label>
              <label>
                Full Name
                <input
                  type="text"
                  value={registerForm.full_name}
                  onChange={(event) => setRegisterForm({ ...registerForm, full_name: event.target.value })}
                />
              </label>
              <label>
                Password
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(event) => setRegisterForm({ ...registerForm, password: event.target.value })}
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
