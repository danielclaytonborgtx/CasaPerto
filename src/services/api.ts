// src/services/api.ts
import axios from 'axios';

// Use a variável de ambiente REACT_APP_API_URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
