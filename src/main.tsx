import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './services/auth'; 
import { PropertyProvider } from './contexts/PropertyContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement); // Cria o root
root.render(
  <React.StrictMode>
    <AuthProvider>  
      <PropertyProvider>
        <App />
      </PropertyProvider>
    </AuthProvider>
  </React.StrictMode>,
);
