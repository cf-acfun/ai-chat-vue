import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
http.interceptors.request.use(
  (config) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    if (apiKey) {
      config.headers.Authorization = `Bearer ${apiKey}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
http.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'Unknown error';
    console.error('API Error:', message);
    return Promise.reject(new Error(message));
  }
);

export default http;
