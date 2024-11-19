// src/services/authContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginService, logoutService } from './authService'; // Agora importa funções de authService

// Tipagem do usuário
interface User {
  id: number;
  username: string;
  email: string;
}

// Tipagem do contexto
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Tipagem das props do AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Componente AuthProvider (somente componente sendo exportado)
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Efeito para recuperar o usuário do localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função de login (chama o serviço de login)
  const login = async (email: string, password: string) => {
    const userData = await loginService(email, password);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Função de logout (chama o serviço de logout)
  const logout = () => {
    logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acessar o contexto
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
