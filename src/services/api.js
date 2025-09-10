import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('phonebook_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('phonebook_token');
      localStorage.removeItem('phonebook_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const getContacts = (page = 1, limit = 50, search = "") =>
  api.get(`/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);

export const createContact = (data) =>
  api.post(`/users`, data);

export const updateContact = (id, data) =>
  api.put(`/users/${id}`, data);

export const deleteContact = (id) =>
  api.delete(`/users/${id}`);

export const getContactById = (id) =>
  api.get(`/users/${id}`);
