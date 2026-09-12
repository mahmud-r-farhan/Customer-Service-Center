import axios from 'axios';
import { logout } from '../redux/authSlice';
import store from '../redux/store';

// Falls back to same-origin relative requests (e.g. `/api`) when
// VITE_SERVER_URL isn't set, which works when the backend is proxied behind
// the same host (dev server proxy or a reverse proxy in production).
const serverUrl = (import.meta.env.VITE_SERVER_URL || '').replace(/\/$/, '');
const api = axios.create({
  baseURL: `${serverUrl}/api`,
  withCredentials: true,
});

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