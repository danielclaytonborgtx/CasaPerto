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
  async getPropertiesByUser(userId: number): Promise<Property[]> {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          *,
          user:users(id, name, username)
        `)
        .eq('user_id', userId)
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
        query = query.or(`user_id.eq.${filters.userId},team_id.eq.${filters.teamId}`)
      } else {
        console.log('🔍 Aplicando filtro de usuário:', filters.userId);
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

      console.log('✅ supabaseProperties.getFilteredProperties: Resultado', data);
      return data || []
    } catch (error) {
      console.error('❌ Erro ao filtrar propriedades:', error)
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
