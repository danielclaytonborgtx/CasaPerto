import { supabase } from '../lib/supabase'
import { Property } from '../types/property'

export interface PropertyData {
  id?: number
  title: string
  description: string
  description1?: string
  price: string
  category: string
  latitude: number
  longitude: number
  user_id: number
  team_id?: number
  images: string[]
  created_at?: string
  updated_at?: string
}

export const supabaseProperties = {
  // Buscar todas as propriedades
  async getAllProperties(): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          user:users(id, name, username)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar propriedades:', error.message)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar propriedades:', error)
      throw error
    }
  },

  // Buscar propriedade por ID
  async getPropertyById(id: number): Promise<Property | null> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          user:users(id, name, username)
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar propriedade:', error.message)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar propriedade:', error)
      return null
    }
  },

  // Buscar propriedades por usuário
  async getPropertiesByUser(userId: number | string): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          user:users(id, name, username)
        `)
        .eq('user_id', String(userId))
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar propriedades do usuário:', error.message)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar propriedades do usuário:', error)
      throw error
    }
  },

  // Buscar propriedades por equipe
  async getPropertiesByTeam(teamId: number): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          user:users(id, name, username)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar propriedades da equipe:', error.message)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar propriedades da equipe:', error)
      throw error
    }
  },

  // Filtrar propriedades por categoria e usuário/equipe
  async getFilteredProperties(filters: {
    userId: number
    teamId?: number
    category?: string
  }): Promise<Property[]> {
    try {
      console.log('🔍 supabaseProperties.getFilteredProperties: Iniciando busca', filters);
      
      let query = supabase
        .from('properties')
        .select(`
          *,
          user:users(id, name, username)
        `)

      // Filtro por usuário ou equipe
      if (filters.teamId) {
        console.log('🔍 Aplicando filtro de usuário/equipe:', `user_id.eq.${filters.userId},team_id.eq.${filters.teamId}`);
        
        // VERIFICAÇÃO CRÍTICA: Se tem teamId, verificar se usuário ainda é membro da equipe
        const { data: membership, error: membershipError } = await supabase
          .from('team_members')
          .select('id')
          .eq('team_id', filters.teamId)
          .eq('user_id', filters.userId)
          .single();

        if (membershipError || !membership) {
          console.log('⚠️ Usuário não é mais membro da equipe, buscando apenas propriedades próprias');
          query = query.eq('user_id', filters.userId);
        } else {
          console.log('✅ Usuário ainda é membro da equipe, buscando propriedades do usuário + da equipe');
          // Buscar propriedades do usuário OU da equipe (apenas de membros ativos)
          
          // Primeiro buscar membros ativos da equipe
          const { data: activeMembers } = await supabase
            .from('team_members')
            .select('user_id')
            .eq('team_id', filters.teamId);
          
          const activeMemberIds = activeMembers?.map(member => member.user_id) || [];
          console.log('✅ Membros ativos da equipe para filtro:', activeMemberIds);
          
          if (activeMemberIds.length > 0) {
            // Buscar propriedades do usuário OU de membros ativos da equipe
            const userIdCondition = `user_id.eq.${filters.userId}`;
            const teamConditions = activeMemberIds.map(id => `user_id.eq.${id}`).join(',');
            query = query.or(`${userIdCondition},(${teamConditions})`);
          } else {
            // Se não há membros ativos, buscar apenas propriedades do usuário
            query = query.eq('user_id', filters.userId);
          }
        }
      } else {
        console.log('🔍 Aplicando filtro de usuário:', filters.userId);
        // Buscar apenas propriedades do usuário
        query = query.eq('user_id', filters.userId)
      }

      // Filtro por categoria
      if (filters.category) {
        console.log('🔍 Aplicando filtro de categoria:', filters.category);
        query = query.eq('category', filters.category)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao filtrar propriedades:', error.message)
        throw new Error(error.message)
      }

      console.log('✅ supabaseProperties.getFilteredProperties: Resultado', {
        total: data?.length || 0,
        properties: data?.map(p => ({
          id: p.id,
          title: p.title,
          user_id: p.user_id,
          team_id: p.team_id,
          category: p.category
        })) || []
      });
      return data || []
    } catch (error) {
      console.error('❌ Erro ao filtrar propriedades:', error)
      throw error
    }
  },

  // Buscar propriedades da equipe (nova função específica)
  async getTeamProperties(teamId: number, category?: string, userId?: string): Promise<Property[]> {
    try {
      console.log('🔍 supabaseProperties.getTeamProperties: Buscando propriedades da equipe', { teamId, category, userId });
      
      // VERIFICAÇÃO CRÍTICA: Se userId for fornecido, verificar se ainda é membro da equipe
      if (userId) {
        console.log('🔍 Verificando se usuário ainda é membro da equipe...');
        const { data: membership, error: membershipError } = await supabase
          .from('team_members')
          .select('id')
          .eq('team_id', teamId)
          .eq('user_id', userId)
          .single();

        if (membershipError || !membership) {
          console.log('⚠️ Usuário não é mais membro da equipe, retornando array vazio');
          return [];
        }
        console.log('✅ Usuário ainda é membro da equipe');
      }
      
      // BUSCAR APENAS PROPRIEDADES DE MEMBROS ATIVOS DA EQUIPE
      console.log('🔍 Buscando membros ativos da equipe...');
      const { data: activeMembers, error: membersError } = await supabase
        .from('team_members')
        .select('user_id')
        .eq('team_id', teamId);

      if (membersError) {
        console.error('❌ Erro ao buscar membros da equipe:', membersError);
        throw new Error(membersError.message);
      }

      const activeMemberIds = activeMembers?.map(member => member.user_id) || [];
      console.log('✅ Membros ativos da equipe:', activeMemberIds);

      if (activeMemberIds.length === 0) {
        console.log('⚠️ Equipe não tem membros ativos, retornando array vazio');
        return [];
      }
      
      // Buscar propriedades apenas dos membros ativos que têm team_id definido
      let query = supabase
        .from('properties')
        .select(`
          *,
          user:users(id, name, username)
        `)
        .eq('team_id', teamId)
        .in('user_id', activeMemberIds); // FILTRO CRÍTICO: Apenas membros ativos

      // Filtro por categoria
      if (category) {
        console.log('🔍 Aplicando filtro de categoria:', category);
        query = query.eq('category', category)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar propriedades da equipe:', error.message)
        throw new Error(error.message)
      }

      console.log('✅ supabaseProperties.getTeamProperties: Resultado', {
        total: data?.length || 0,
        activeMembers: activeMemberIds.length,
        properties: data?.map(p => ({
          id: p.id,
          title: p.title,
          user_id: p.user_id,
          team_id: p.team_id,
          category: p.category
        })) || []
      });
      return data || []
    } catch (error) {
      console.error('❌ Erro ao buscar propriedades da equipe:', error)
      throw error
    }
  },

  // Criar nova propriedade
  async createProperty(propertyData: PropertyData): Promise<Property> {
    try {
      console.log('🔍 supabaseProperties.createProperty: Criando propriedade', propertyData);
      
      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...propertyData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select(`
          *,
          user:users(id, name, username)
        `)
        .single()

      if (error) {
        console.error('❌ Erro ao criar propriedade:', error.message)
        throw new Error(error.message)
      }

      console.log('✅ supabaseProperties.createProperty: Propriedade criada com sucesso', data);
      return data
    } catch (error) {
      console.error('❌ Erro ao criar propriedade:', error)
      throw error
    }
  },

  // Atualizar propriedade
  async updateProperty(id: number, updates: Partial<PropertyData>): Promise<Property> {
    try {
      console.log('🔍 supabaseProperties.updateProperty: Atualizando propriedade', { id, updates });
      
      const { data, error } = await supabase
        .from('properties')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select(`
          *,
          user:users(id, name, username)
        `)
        .single()

      if (error) {
        console.error('❌ Erro ao atualizar propriedade:', error.message)
        throw new Error(error.message)
      }

      console.log('✅ supabaseProperties.updateProperty: Propriedade atualizada com sucesso', data);
      return data
    } catch (error) {
      console.error('❌ Erro ao atualizar propriedade:', error)
      throw error
    }
  },

  // Deletar propriedade
  async deleteProperty(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar propriedade:', error.message)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erro ao deletar propriedade:', error)
      throw error
    }
  }
}
