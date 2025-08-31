import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for loading states
api.interceptors.request.use((config) => {
  console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    throw error;
  }
);

export const apiService = {
  // Health check
  healthCheck: async () => {
    const response = await api.get('/');
    return response.data;
  },

  // Get records (GET /records)
  getRecords: async (skip = 0, limit = 100) => {
    const response = await api.get('/records', {
      params: { skip, limit }
    });
    return response.data;
  },

  // Scrape products (POST /scrape)
  scrapeProducts: async (query, limit = 100) => {
    const response = await api.post('/scrape', null, {
      params: {
        source: 'amazon',
        query,
        limit
      }
    });
    return response.data;
  }
};
