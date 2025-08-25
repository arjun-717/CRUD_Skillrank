import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;


export const getUsers = (page = 1, limit = 50, search = "") =>
  axios.get(`${API_BASE}/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);


export const createUser = (data) =>
  axios.post(`${API_BASE}/users`, data);

export const updateUser = (id, data) =>
  axios.put(`${API_BASE}/users/${id}`, data);

export const deleteUser = (id) =>
  axios.delete(`${API_BASE}/users/${id}`);
