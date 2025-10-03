import { supabase } from '../lib/supabase'
import { User } from '../types/property'

export interface AuthUser {
  id: number
  name: string
  email: string
  username: string
  picture?: string
  created_at: string
  updated_at: string
}

export const supabaseAuth = {
  // Login com email e senha
  async login(email: string, password: string): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Erro no login:', error.message)
        throw new Error(error.message)
      }

      if (data.user) {
        // Buscar dados do usuário na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()

        if (userError) {
          console.error('Erro ao buscar dados do usuário:', userError.message)
          throw new Error('Usuário não encontrado')
        }

        return userData
      }

      return null
    } catch (error) {
      console.error('Erro no login:', error)
      throw error
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Erro no logout:', error.message)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erro no logout:', error)
      throw error
    }
  },

  // Registrar novo usuário
  async signUp(userData: {
    name: string
    email: string
    username: string
    password: string
  }): Promise<AuthUser | null> {
    try {
      // Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      if (authError) {
        console.error('Erro ao criar usuário:', authError.message)
        throw new Error(authError.message)
      }

      if (authData.user) {
        // Criar registro na tabela users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .insert({
            name: userData.name,
            email: userData.email,
            username: userData.username,
          })
          .select()
          .single()

        if (userError) {
          console.error('Erro ao criar dados do usuário:', userError.message)
          throw new Error(userError.message)
        }

        return userData
      }

      return null
    } catch (error) {
      console.error('Erro no registro:', error)
      throw error
    }
  },

  // Obter usuário atual
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', user.email)
          .single()

        if (error) {
          console.error('Erro ao buscar dados do usuário:', error.message)
          return null
        }

        return userData
      }

      return null
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error)
      return null
    }
  },

  // Atualizar perfil do usuário
  async updateProfile(userId: number, updates: {
    name?: string
    username?: string
    picture?: string
  }): Promise<AuthUser | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar perfil:', error.message)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      throw error
    }
  }
}
