import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginService, logoutService } from './authService';

export interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  password: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
  teamMembers?: TeamMember[]
}

export interface Team {
  id: number;
  name: string;
  teamMembers: TeamMember[]
}

interface AuthContextType {
  user: User | null;
  team: Team | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  createTeam: (teamData: Team) => void;
  setUser: (user: User | null) => void;
  updateTeamId: (teamId: number) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [team, setTeam] = useState<Team | null>(null);

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

  // ... existing code ...

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedTeam = localStorage.getItem('team');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        if (parsedUser.id && parsedUser.email) {
          // console.log("Usuário carregado do localStorage:", parsedUser);
          setUser(parsedUser);

          // Correção aqui
          if (parsedUser.teamMembers?.length && !storedTeam) {
            fetchTeamById(parsedUser.teamMembers[0].teamId)
              .then((teamData) => {
                setTeam(teamData);
                localStorage.setItem('team', JSON.stringify(teamData));
              })
              .catch((error) => console.error("Erro ao carregar equipe", error));
          } else if (storedTeam) {
            try {
              const parsedTeam = JSON.parse(storedTeam) as Team;
              if (parsedTeam.id && parsedTeam.name) {
                console.log("Equipe carregada do localStorage:", parsedTeam);
                setTeam(parsedTeam);
              }
            } catch (error) {
              console.error("Erro ao analisar equipe do localStorage:", error);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao analisar usuário do localStorage:", error);
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

        // Correção aqui também
        if (userData.teamMembers?.length && !team) {
          fetchTeamById(userData.teamMembers[0].teamId)
            .then((teamData) => {
              console.log("Equipe encontrada após login:", teamData);
              setTeam(teamData);
              localStorage.setItem('team', JSON.stringify(teamData));
            })
            .catch((error) => {
              console.error("Erro ao buscar equipe após login", error);
            });
        }
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro no login. Verifique suas credenciais e tente novamente.");
    }
  };

// ... rest of the code remains the same ...

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

  const updateTeamId = async (teamId: number) => {
    if (!user) {
      console.error("Usuário não encontrado para atualizar o teamId");
      return;
    }

    const updatedUser = { 
      ...user, 
      teamMembers: [{ id: 0, userId: user.id, teamId: teamId }] 
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    try {
      const teamData = await fetchTeamById(teamId);
      setTeam(teamData);
      localStorage.setItem('team', JSON.stringify(teamData));
      console.log("teamId atualizado e equipe correspondente carregada:", teamData);
    } catch (error) {
      console.error("Erro ao atualizar o teamId e carregar a equipe", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, team, login, logout, createTeam, setUser, updateTeamId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};