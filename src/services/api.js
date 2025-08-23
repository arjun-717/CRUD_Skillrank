import axios from "axios";

const API_BASE = "https://a6f7vpvrv1.execute-api.eu-north-1.amazonaws.com/default";


export const getUsers = (page = 1, limit = 50, search = "") =>
  axios.get(`${API_BASE}/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`);


export const createUser = (data) =>
  axios.post(`${API_BASE}/users`, data);

export const updateUser = (id, data) =>
  axios.put(`${API_BASE}/users/${id}`, data);

export const deleteUser = (id) =>
  axios.delete(`${API_BASE}/users/${id}`);
