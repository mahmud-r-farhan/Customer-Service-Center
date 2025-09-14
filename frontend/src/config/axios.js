import axios from 'axios';
import { logout } from '../redux/authSlice';
import store from '../redux/store';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_URL}/api`,
});

// Automatically attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 Unauthorized (e.g. expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401 && message === 'Token expired') {
      // Log the user out in Redux
      store.dispatch(logout());

      // Optional: redirect to login
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;