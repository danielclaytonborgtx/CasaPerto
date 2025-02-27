import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginService, logoutService } from './authService';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
  teamId?: number; // Adicionado teamId ao usuário
  team?: Team;
}

export interface Team {
  id: number;
  name: string;
  members: User[];
}

interface AuthContextType {
  user: User | null;
  team: Team | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createTeam: (teamData: Team) => void;
  setUser: (user: User | null) => void; // Adicionado setUser
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);

  // Função para buscar a equipe por ID
  const fetchTeamById = async (teamId: number): Promise<Team> => {
    try {
      console.log(`Buscando equipe com ID: ${teamId}`);
      const response = await fetch(`/api/teams/${teamId}`);
      const teamData = await response.json();
      console.log(`Equipe encontrada:`, teamData);
      return teamData;
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
      throw new Error("Erro ao buscar equipe");
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTeam = localStorage.getItem('team');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Usuário carregado do localStorage:", parsedUser);
      setUser(parsedUser);

      // Se o usuário tem um teamId e a equipe não está no localStorage, busque a equipe
      if (parsedUser.teamId && !storedTeam) {
        fetchTeamById(parsedUser.teamId)
          .then((teamData) => {
            setTeam(teamData);
            localStorage.setItem('team', JSON.stringify(teamData));
          })
          .catch((error) => console.error("Erro ao carregar equipe", error));
      } else if (storedTeam) {
        console.log("Equipe carregada do localStorage:", JSON.parse(storedTeam));
        setTeam(JSON.parse(storedTeam));
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await loginService(email, password);
      if (userData) {
        console.log("Login bem-sucedido. Dados do usuário:", userData);
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Se o usuário tem um teamId e a equipe não foi carregada, busque a equipe
        if (userData.teamId && !team) {
          fetchTeamById(userData.teamId)
            .then((teamData) => {
              console.log("Equipe encontrada após login:", teamData);
              setTeam(teamData);
              localStorage.setItem('team', JSON.stringify(teamData));
            })
            .catch((error) => console.error("Erro ao buscar equipe após login", error));
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
    }
  };

  const logout = () => {
    logoutService();
    setUser(null);
    setTeam(null);
    localStorage.removeItem('user');
    localStorage.removeItem('team');
    console.log("Usuário deslogado");
  };

  const createTeam = (teamData: Team) => {
    setTeam(teamData);
    localStorage.setItem('team', JSON.stringify(teamData));
    console.log("Equipe criada:", teamData);
  };

  return (
    <AuthContext.Provider value={{ user, team, login, logout, createTeam, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};