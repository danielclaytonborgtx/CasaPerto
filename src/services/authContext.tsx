import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabaseAuth } from './supabaseAuth';
import { supabase } from '../lib/supabase';

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
  refreshUserData: () => Promise<void>;
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
          console.log("🔄 AUTHCONTEXT: Usuário carregado do localStorage:", parsedUser);
          setUser(parsedUser);

          // Verificar se o usuário tem dados de equipe atualizados
          if (parsedUser.teamMembers?.length && !storedTeam) {
            console.log("🔄 AUTHCONTEXT: Buscando equipe do usuário...");
            fetchTeamById(parsedUser.teamMembers[0].teamId)
              .then((teamData) => {
                console.log("✅ AUTHCONTEXT: Equipe encontrada:", teamData);
                setTeam(teamData);
                localStorage.setItem('team', JSON.stringify(teamData));
              })
              .catch((error) => console.error("❌ AUTHCONTEXT: Erro ao carregar equipe", error));
          } else if (storedTeam) {
            try {
              const parsedTeam = JSON.parse(storedTeam) as Team;
              if (parsedTeam.id && parsedTeam.name) {
                console.log("✅ AUTHCONTEXT: Equipe carregada do localStorage:", parsedTeam);
                setTeam(parsedTeam);
              }
            } catch (error) {
              console.error("❌ AUTHCONTEXT: Erro ao analisar equipe do localStorage:", error);
            }
          } else {
            // Se o usuário não tem dados de equipe, verificar se ele está em alguma equipe
            console.log("🔍 AUTHCONTEXT: Verificando se usuário está em alguma equipe...");
            checkAndUpdateUserTeamData(parsedUser);
          }
        }
      } catch (error) {
        console.error("❌ AUTHCONTEXT: Erro ao analisar usuário do localStorage:", error);
      }
    }
  }, []);

  // Função para verificar e atualizar dados da equipe do usuário
  const checkAndUpdateUserTeamData = async (user: User) => {
    try {
      console.log('🔍 AUTHCONTEXT: Verificando dados da equipe do usuário...');
      
      const { data: updatedUser, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          team_members:team_members(
            *,
            team:teams(*)
          )
        `)
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.error('❌ AUTHCONTEXT: Erro ao buscar dados atualizados:', userError);
        return;
      }

      // Converter team_members para o formato esperado
      if (updatedUser && updatedUser.team_members) {
        updatedUser.teamMembers = updatedUser.team_members.map((tm: any) => ({
          id: tm.id,
          userId: tm.user_id,
          teamId: tm.team_id
        }));
        delete updatedUser.team_members;
      }

      console.log('✅ AUTHCONTEXT: Dados atualizados do usuário:', updatedUser);
      
      // Sempre atualizar os dados do usuário, independente de ter equipe ou não
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('✅ AUTHCONTEXT: Dados do usuário atualizados no contexto');
      
      // Se o usuário tem equipe, carregar dados da equipe
      if (updatedUser.teamMembers?.length) {
        console.log('✅ AUTHCONTEXT: Usuário tem equipe, carregando dados da equipe...');
        const teamId = updatedUser.teamMembers[0].teamId;
        try {
          const teamData = await fetchTeamById(teamId);
          setTeam(teamData);
          localStorage.setItem('team', JSON.stringify(teamData));
          console.log('✅ AUTHCONTEXT: Equipe carregada automaticamente:', teamData);
        } catch (error) {
          console.error('❌ AUTHCONTEXT: Erro ao carregar equipe:', error);
        }
      } else {
        console.log('ℹ️ AUTHCONTEXT: Usuário não tem equipe');
      }
      
    } catch (error) {
      console.error('❌ AUTHCONTEXT: Erro ao verificar dados da equipe:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🔄 AUTHCONTEXT: Iniciando processo de login...')
      console.log('🔄 AUTHCONTEXT: Chamando supabaseAuth.login...')
      
      const userData = await supabaseAuth.login(email, password);
      
      console.log('📊 AUTHCONTEXT: Resposta do supabaseAuth.login:', {
        userData: userData ? 'Dados recebidos' : 'Nenhum dado',
        userDataDetails: userData ? {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          username: userData.username
        } : null
      })
      
      if (userData) {
        console.log("✅ AUTHCONTEXT: Login bem-sucedido. Dados do usuário:", userData);
        
        // Verificar se as equipes do usuário ainda existem
        if (userData.teamMembers?.length) {
          console.log("🔍 AUTHCONTEXT: Verificando se as equipes do usuário ainda existem...");
          const validTeamMembers = [];
          
          for (const teamMember of userData.teamMembers) {
            try {
              const { data: teamExists, error: teamError } = await supabase
                .from('teams')
                .select('id')
                .eq('id', teamMember.teamId)
                .single();
              
              if (teamError || !teamExists) {
                console.log("⚠️ AUTHCONTEXT: Equipe não existe mais:", teamMember.teamId);
                // Limpar team_id das propriedades do usuário
                await supabase
                  .from('properties')
                  .update({ team_id: null })
                  .eq('user_id', userData.id)
                  .eq('team_id', teamMember.teamId);
                console.log("🧹 AUTHCONTEXT: Team_id das propriedades limpo para equipe:", teamMember.teamId);
              } else {
                console.log("✅ AUTHCONTEXT: Equipe existe:", teamMember.teamId);
                validTeamMembers.push(teamMember);
              }
            } catch (error) {
              console.error("❌ AUTHCONTEXT: Erro ao verificar equipe:", teamMember.teamId, error);
            }
          }
          
          // Atualizar teamMembers apenas com equipes válidas
          userData.teamMembers = validTeamMembers.length > 0 ? validTeamMembers : undefined;
          console.log("📊 AUTHCONTEXT: TeamMembers atualizados:", userData.teamMembers);
        }
        
        console.log("🔄 AUTHCONTEXT: Definindo usuário no estado...");
        setUser(userData);
        console.log("🔄 AUTHCONTEXT: Salvando usuário no localStorage...");
        localStorage.setItem('user', JSON.stringify(userData));
        console.log("✅ AUTHCONTEXT: Usuário salvo no localStorage");

        // Buscar equipe do usuário se existir
        if (userData.teamMembers?.length && !team) {
          console.log("🔄 AUTHCONTEXT: Buscando equipe do usuário...");
          fetchTeamById(userData.teamMembers[0].teamId)
            .then((teamData) => {
              console.log("✅ AUTHCONTEXT: Equipe encontrada após login:", teamData);
              setTeam(teamData);
              localStorage.setItem('team', JSON.stringify(teamData));
            })
            .catch((error) => {
              console.error("❌ AUTHCONTEXT: Erro ao buscar equipe após login", error);
            });
        } else {
          console.log("ℹ️ AUTHCONTEXT: Usuário não tem equipe ou equipe já carregada");
        }
      } else {
        console.log("⚠️ AUTHCONTEXT: Nenhum dado de usuário retornado");
      }
    } catch (error) {
      console.error("💥 AUTHCONTEXT: Erro no login:", error);
      console.error("💥 AUTHCONTEXT: Stack trace:", error instanceof Error ? error.stack : 'N/A');
      alert("Erro no login. Verifique suas credenciais e tente novamente.");
    }
  };

// ... rest of the code remains the same ...

  const logout = async () => {
    try {
      await supabaseAuth.logout();
      setUser(null);
      setTeam(null);
      localStorage.removeItem('user');
      localStorage.removeItem('team');
      console.log("Usuário deslogado");
    } catch (error) {
      console.error("Erro no logout:", error);
      // Mesmo com erro, limpar dados locais
      setUser(null);
      setTeam(null);
      localStorage.removeItem('user');
      localStorage.removeItem('team');
    }
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

  const refreshUserData = async () => {
    if (!user) {
      console.error("Usuário não encontrado para atualizar dados");
      return;
    }

    try {
      console.log('🔄 AUTHCONTEXT: Atualizando dados do usuário...');
      
      // Buscar dados atualizados do usuário com equipe
      const { data: updatedUser, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          team_members:team_members(
            *,
            team:teams(*)
          )
        `)
        .eq('id', user.id)
        .single();
      
      if (userError) {
        console.error('❌ AUTHCONTEXT: Erro ao buscar dados atualizados:', userError);
        return;
      }

      // Converter team_members para o formato esperado
      if (updatedUser && updatedUser.team_members) {
        updatedUser.teamMembers = updatedUser.team_members.map((tm: any) => ({
          id: tm.id,
          userId: tm.user_id,
          teamId: tm.team_id
        }));
        delete updatedUser.team_members;
      }

      console.log('✅ AUTHCONTEXT: Dados atualizados do usuário:', updatedUser);
      
      // Atualizar o usuário no contexto
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Se o usuário tem equipe, carregar dados da equipe
      if (updatedUser.teamMembers?.length) {
        const teamId = updatedUser.teamMembers[0].teamId;
        try {
          const teamData = await fetchTeamById(teamId);
          setTeam(teamData);
          localStorage.setItem('team', JSON.stringify(teamData));
          console.log('✅ AUTHCONTEXT: Equipe atualizada:', teamData);
        } catch (error) {
          console.error('❌ AUTHCONTEXT: Erro ao carregar equipe:', error);
        }
      }
      
    } catch (error) {
      console.error('❌ AUTHCONTEXT: Erro ao atualizar dados do usuário:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, team, login, logout, createTeam, setUser, updateTeamId, refreshUserData }}>
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