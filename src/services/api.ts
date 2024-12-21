import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
