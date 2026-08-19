import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Automatically attach the access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ums_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Automatically handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('ums_refresh_token');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, { refresh: refreshToken });
          localStorage.setItem('ums_access_token', response.data.access);
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('ums_access_token');
          localStorage.removeItem('ums_refresh_token');
          window.location.href = '/login'; 
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;