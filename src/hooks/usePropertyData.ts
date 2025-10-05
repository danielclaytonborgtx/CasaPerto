import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../services/authContext';
import { supabaseProperties } from '../services/supabaseProperties';
import { User, Property } from '../types/property';

export const usePropertyData = (isRent: boolean) => {
  const [user, setUser] = useState<User>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // const [teamMembers, setTeamMembers] = useState<number[]>([]);
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
          teamMember: (authUser.teamMembers || []).map(tm => ({
            teamId: tm.teamId,
            team: { id: tm.teamId, name: 'Team' } // Placeholder, será carregado depois
          })),
        });
      } catch (err) {
        console.error("Erro ao carregar usuário", err);
        setError("Erro ao carregar dados do usuário");
      }
    };
    fetchUser();
  }, [authUser]);

  // Carregar membros da equipe - DESABILITADO TEMPORARIAMENTE
  // const loadTeamMembers = useCallback(async () => {
  //   if (!user?.teamMember?.length) return setTeamMembers([]);
  //   try {
  //     const teamId = user.teamMember[0].teamId;
  //     const res = await fetch(`https://servercasaperto.onrender.com/team/${teamId}`);
  //     const data = await res.json();
  //     setTeamMembers(data.members.map((m: { userId: number }) => m.userId));
  //   } catch (err) {
  //     console.error("Erro ao carregar membros da equipe", err);
  //     setError("Erro ao carregar membros da equipe");
  //   }
  // }, [user]);

  // Carregar propriedades
  const loadProperties = useCallback(async () => {
    if (!user) return;
    try {
      const teamId = user.teamMember?.[0]?.teamId;
      const category = isRent ? "venda" : "aluguel";
      const hasTeam = !!teamId;
      
      console.log('🔍 usePropertyData: Carregando propriedades', {
        userId: user.id,
        teamId,
        category,
        isRent,
        hasTeam
      });
      
      let allProperties: Property[] = [];
      
      if (hasTeam) {
        // USUÁRIO COM EQUIPE: Buscar propriedades do usuário + da equipe
        console.log('🔍 usePropertyData: Usuário COM equipe - buscando propriedades da equipe');
        console.log('🔍 usePropertyData: Detalhes da equipe:', {
          teamId,
          teamIdType: typeof teamId,
          userTeamMembers: user.teamMember
        });
        
        // Buscar propriedades do usuário
        const userProperties = await supabaseProperties.getPropertiesByUser(user.id);
        console.log('✅ usePropertyData: Propriedades do usuário carregadas', {
          count: userProperties.length,
          properties: userProperties.map(p => ({ id: p.id, title: p.title, userId: p.userId, teamId: p.teamId }))
        });
        
        // Buscar propriedades da equipe
        console.log('🔍 usePropertyData: Buscando propriedades da equipe com teamId:', teamId);
        const teamProperties = await supabaseProperties.getTeamProperties(teamId, category, String(user.id));
        console.log('✅ usePropertyData: Propriedades da equipe carregadas', {
          count: teamProperties.length,
          properties: teamProperties.map(p => ({ id: p.id, title: p.title, userId: p.userId, teamId: p.teamId }))
        });
        
        // Combinar propriedades do usuário e da equipe
        allProperties = [...userProperties, ...teamProperties];
        
        // Remover duplicatas (caso o usuário tenha propriedades que também estão na equipe)
        const uniqueProperties = allProperties.filter((property, index, self) => 
          index === self.findIndex(p => p.id === property.id)
        );
        allProperties = uniqueProperties;
        
        console.log('✅ usePropertyData: Usuário COM equipe - propriedades combinadas', {
          userProperties: userProperties.length,
          teamProperties: teamProperties.length,
          total: allProperties.length,
          finalProperties: allProperties.map(p => ({ id: p.id, title: p.title, userId: p.userId, teamId: p.teamId }))
        });
        
      } else {
        // USUÁRIO SEM EQUIPE: Buscar apenas suas próprias propriedades
        console.log('🔍 usePropertyData: Usuário SEM equipe - buscando apenas suas propriedades');
        
        allProperties = await supabaseProperties.getPropertiesByUser(user.id);
        console.log('✅ usePropertyData: Usuário SEM equipe - apenas suas propriedades', allProperties.length);
      }
      
      // Aplicar filtro de categoria se necessário
      if (category) {
        allProperties = allProperties.filter(p => p.category === category);
      }
      
      console.log('✅ usePropertyData: Propriedades finais carregadas', {
        hasTeam,
        total: allProperties.length,
        properties: allProperties.map(p => ({ 
          id: p.id, 
          title: p.title, 
          userId: p.userId,
          teamId: p.teamId,
          category: p.category 
        }))
      });
      setProperties(allProperties);
    } catch (err) {
      console.error("❌ usePropertyData: Erro ao carregar propriedades", err);
      setError("Erro ao carregar propriedades");
    } finally {
      setIsLoaded(true);
    }
  }, [user, isRent]);

  // Carregar dados quando o usuário estiver disponível
  useEffect(() => {
    if (user) {
      console.log('🔍 usePropertyData: Usuário disponível, carregando propriedades', {
        userId: user.id,
        userName: user.name,
        hasTeam: !!user.teamMember?.length,
        teamMembers: user.teamMember
      });
      loadProperties();
      // loadTeamMembers();
    }
  }, [user, loadProperties]);

  // As propriedades já vêm filtradas do Supabase, não precisamos filtrar novamente
  console.log('🔍 usePropertyData: Propriedades antes do filtro', properties);
  console.log('🔍 usePropertyData: User ID', user?.id, 'Type:', typeof user?.id);
  
  return {
    user,
    properties: properties, // Usar as propriedades diretamente do Supabase
    error,
    isLoaded,
    reloadProperties: loadProperties
  };
}; 