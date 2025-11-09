import axios from 'axios';

/**
 * Axios instance for API calls
 * Automatically adds JWT token to requests
 * Handles 401 errors by redirecting to login
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Send cookies with requests
});

/**
 * Request Interceptor
 * Add JWT token from localStorage to Authorization header
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle 401 errors (Unauthorized) by clearing auth and redirecting to login
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        // Clear authentication data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      
      // Handle 403 Forbidden
      if (error.response.status === 403) {
        console.error('Access forbidden:', error.response.data.error);
      }
      
      // Handle 404 Not Found
      if (error.response.status === 404) {
        console.error('Resource not found:', error.response.data.error);
      }
      
      // Handle 500 Server Error
      if (error.response.status >= 500) {
        console.error('Server error:', error.response.data.error);
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network error - no response received');
    } else {
      // Error setting up the request
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
