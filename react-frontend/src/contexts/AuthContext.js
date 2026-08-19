import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('ums_access_token') || '');
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('ums_refresh_token') || '');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveTokens = (access, refresh) => {
    localStorage.setItem('ums_access_token', access);
    localStorage.setItem('ums_refresh_token', refresh);
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const clearSession = () => {
    localStorage.removeItem('ums_access_token');
    localStorage.removeItem('ums_refresh_token');
    setAccessToken('');
    setRefreshToken('');
    setProfile(null);
  };

  const loadProfile = async () => {
    try {
      const response = await api.get('/users/profile/');
      setProfile(response.data);
    } catch (error) {
      clearSession();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  const login = async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    saveTokens(response.data.access, response.data.refresh);
    await loadProfile();
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout/', { refresh: refreshToken });
    } finally {
      clearSession();
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, profile, login, logout, loading, loadProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);