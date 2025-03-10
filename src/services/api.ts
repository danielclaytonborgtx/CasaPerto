import axios from 'axios';

const API_URL = import.meta.env.MODE === 'development' 
  ? import.meta.env.VITE_API_URL_DEV 
  : import.meta.env.VITE_API_URL;

console.log('API_URL:', API_URL); 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
