import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './App.css';
import AuthPage from './pages/AuthPage';
import ProfilePage from './pages/ProfilePage';
import ProfileOverview from './pages/ProfileOverview';
import PasswordPage from './pages/PasswordPage';
import AdminUsersPage from './pages/AdminUsersPage';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';
const ACCESS_TOKEN_KEY = 'ums_access_token';
const REFRESH_TOKEN_KEY = 'ums_refresh_token';

const getErrorMessage = (error) => {
  if (error.response && error.response.data) {
    const data = error.response.data;
    if (typeof data === 'string') {
      return data;
    }
    if (data.detail) {
      return data.detail;
    }
    const firstKey = Object.keys(data)[0];
    const firstValue = data[firstKey];
    if (Array.isArray(firstValue) && firstValue.length > 0) {
      return `${firstKey}: ${firstValue[0]}`;
    }
    if (typeof firstValue === 'string') {
      return `${firstKey}: ${firstValue}`;
    }
  }
  return error.message || 'Request failed.';
};

function App() {
  const client = useMemo(
    () =>
      axios.create({
        baseURL: API_BASE_URL,
      }),
    []
  );

  const [accessToken, setAccessToken] = useState(localStorage.getItem(ACCESS_TOKEN_KEY) || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem(REFRESH_TOKEN_KEY) || '');
  const [page, setPage] = useState('login');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);

  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', email: '', password: '', full_name: '' });
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    address: '',
    designation: '',
    organization: '',
    mobile_number: '',
    working_language: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });

  const saveTokens = (access, refresh) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const clearSession = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setAccessToken('');
    setRefreshToken('');
    setProfile(null);
    setAdminUsers([]);
  };

  const requestWithAuth = async (config, retry = true) => {
    try {
      return await client.request({
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      const isUnauthorized = error.response && error.response.status === 401;
      if (!retry || !isUnauthorized || !refreshToken) {
        throw error;
      }
      const refreshResponse = await client.post('/auth/token/refresh/', { refresh: refreshToken });
      const nextAccessToken = refreshResponse.data.access;
      localStorage.setItem(ACCESS_TOKEN_KEY, nextAccessToken);
      setAccessToken(nextAccessToken);

      return client.request({
        ...config,
        headers: {
          ...(config.headers || {}),
          Authorization: `Bearer ${nextAccessToken}`,
        },
      });
    }
  };

  const loadProfile = async () => {
    const response = await requestWithAuth({ method: 'get', url: '/users/profile/' });
    setProfile(response.data);
    setProfileForm({
      full_name: response.data.full_name || '',
      address: response.data.address || '',
      designation: response.data.designation || '',
      organization: response.data.organization || '',
      mobile_number: response.data.mobile_number || '',
      working_language: response.data.working_language || '',
    });
  };

  useEffect(() => {
    if (!accessToken || !refreshToken) {
      return;
    }
    setLoading(true);
    setErrorMessage('');
    loadProfile()
      .then(() => {
        setStatusMessage('Logged in session restored.');
        setPage('profile');
      })
      .catch((error) => {
        clearSession();
        setErrorMessage(getErrorMessage(error));
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');
    setErrorMessage('');
    try {
      const response = await client.post('/auth/login/', loginForm);
      saveTokens(response.data.access, response.data.refresh);
      await loadProfile();
      setStatusMessage('Login successful.');
      setPage('profile');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');
    setErrorMessage('');
    try {
      await client.post('/auth/register/', registerForm);
      setStatusMessage('Registration successful. You can now log in.');
      setRegisterForm({ username: '', email: '', password: '', full_name: '' });
      setPage('login');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');
    setErrorMessage('');
    try {
      await requestWithAuth({
        method: 'put',
        url: '/users/profile/',
        data: profileForm,
      });
      await loadProfile();
      setStatusMessage('Profile updated successfully.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatusMessage('');
    setErrorMessage('');
    try {
      await requestWithAuth({
        method: 'post',
        url: '/auth/change-password/',
        data: passwordForm,
      });
      setPasswordForm({ old_password: '', new_password: '', confirm_password: '' });
      setStatusMessage('Password changed. Please log in again.');
      clearSession();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setStatusMessage('');
    setErrorMessage('');
    try {
      await requestWithAuth({
        method: 'post',
        url: '/auth/logout/',
        data: { refresh: refreshToken },
      });
      clearSession();
      setStatusMessage('Logged out successfully.');
      setPage('login');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    setLoading(true);
    setStatusMessage('');
    setErrorMessage('');
    try {
      const response = await requestWithAuth({
        method: 'get',
        url: '/users/details',
      });
      setAdminUsers(response.data.results || response.data);
      setStatusMessage('Admin user list loaded.');
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="App">
      <h1>User Management App</h1>
      
      {statusMessage && <p className="success">{statusMessage}</p>}
      {errorMessage && <p className="error">{errorMessage}</p>}

      {!accessToken ? (
        <AuthPage
          page={page}
          setPage={setPage}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          registerForm={registerForm}
          setRegisterForm={setRegisterForm}
          handleLogin={handleLogin}
          handleRegister={handleRegister}
          loading={loading}
        />
      ) : (
        <div className="grid">
          {page === 'profile' && (
            <ProfileOverview
              profile={profile}
              onEditProfile={() => setPage('profile-edit')}
              onChangePassword={() => setPage('change-password')}
              onAdminUsers={() => setPage('admin-users')}
            />
          )}

          {page === 'profile-edit' && (
            <ProfilePage
              profile={profile}
              profileForm={profileForm}
              setProfileForm={setProfileForm}
              handleProfileUpdate={handleProfileUpdate}
              handleLogout={handleLogout}
              loading={loading}
              onBack={() => setPage('profile')}
            />
          )}

          {page === 'change-password' && (
            <PasswordPage passwordForm={passwordForm} setPasswordForm={setPasswordForm} handlePasswordChange={handlePasswordChange} loading={loading} onBack={() => setPage('profile')} />
          )}

          {page === 'admin-users' && (
            <AdminUsersPage adminUsers={adminUsers} loadAdminUsers={loadAdminUsers} loading={loading} onBack={() => setPage('profile')} />
          )}
        </div>
      )}
    </main>
  );
}

export default App;