// src/services/api.ts
import axios from 'axios';
import Constants from 'expo-constants';

const api = axios.create({
  baseURL: Constants.manifest?.extra?.API_URL || 'http://0.0.0.0:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
