import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../services/authContext';
import { supabaseProperties } from '../services/supabaseProperties';
import { User, Property } from '../types/property';

export const usePropertyData = (isRent: boolean) => {
  const [user, setUser] = useState<User>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [teamMembers, setTeamMembers] = useState<number[]>([]);
  const { user: authUser } = useAuth();

  // Carregar dados do usuário
  useEffect(() => {
    if (!authUser) return;
    const fetchUser = async () => {
      try {
        // O usuário já vem com os dados necessários do authContext
        setUser({
          id: authUser.id,
          name: authUser.name,
          teamMember: authUser.teamMembers || [],
        });
      } catch (err) {
        console.error("Erro ao carregar usuário", err);
        setError("Erro ao carregar dados do usuário");
      }
    };
    fetchUser();
  }, [authUser]);

  // Carregar membros da equipe
  const loadTeamMembers = useCallback(async () => {
    if (!user?.teamMember?.length) return setTeamMembers([]);
    try {
      const teamId = user.teamMember[0].teamId;
      const res = await fetch(`https://servercasaperto.onrender.com/team/${teamId}`);
      const data = await res.json();
      setTeamMembers(data.members.map((m: { userId: number }) => m.userId));
    } catch (err) {
      console.error("Erro ao carregar membros da equipe", err);
      setError("Erro ao carregar membros da equipe");
    }
  }, [user]);

  // Carregar propriedades
  const loadProperties = useCallback(async () => {
    if (!user) return;
    try {
      const teamId = user.teamMember[0]?.teamId;
      const data = await supabaseProperties.getFilteredProperties({
        userId: user.id,
        teamId: teamId,
        category: isRent ? "Venda" : "Aluguel"
      });
      setProperties(data);
    } catch (err) {
      console.error("Erro ao carregar propriedades", err);
      setError("Erro ao carregar propriedades");
    } finally {
      setIsLoaded(true);
    }
  }, [user, isRent]);

  // Carregar dados quando o usuário estiver disponível
  useEffect(() => {
    if (user) {
      loadProperties();
      loadTeamMembers();
    }
  }, [user, loadProperties, loadTeamMembers]);

  // Filtrar propriedades com base na categoria e membros da equipe
  const filteredProperties = properties.filter((p) => {
    if (!user) return false;
    const category = isRent ? "Venda" : "Aluguel";
    const isFromUser = p.userId === user.id;
    const isFromTeam = teamMembers.includes(p.userId);
    return (isFromUser || isFromTeam) && p.category === category;
  });

  return {
    user,
    properties: filteredProperties,
    error,
    isLoaded
  };
}; 