import axios from 'axios';

// Determinar a URL correta com base no ambiente
const API_URL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL_DEV;

console.log('API_URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
