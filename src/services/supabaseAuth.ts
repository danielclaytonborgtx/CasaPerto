import { supabase } from '../lib/supabase'
import { User } from '../types/property'

export interface AuthUser {
  id: string // Changed from number to string (UUID)
  name: string
  email: string
  username: string
  picture?: string
  created_at: string
  updated_at: string
  teamMembers?: { id: number; userId: string; teamId: number }[]
}

export const supabaseAuth = {
  // Login com email e senha
  async login(email: string, password: string): Promise<AuthUser | null> {
    try {
      console.log('🚀 ===== INICIANDO PROCESSO DE LOGIN =====')
      console.log('🔐 Dados de login:', { email, passwordLength: password.length })
      
      // Verificar se o usuário existe na tabela users ANTES de tentar autenticar
      console.log('🔍 ETAPA 1: Verificando se usuário existe na tabela users...')
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select(`
          *,
          team_members:team_members(
            *,
            team:teams(*)
          )
        `)
        .eq('email', email)
      
      const existingUser = existingUsers && existingUsers.length > 0 ? existingUsers[0] : null

      console.log('📊 ETAPA 1 - Resultado da busca na tabela users:', {
        exists: existingUser ? 'Sim' : 'Não',
        userData: existingUser ? {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          username: existingUser.username,
          teamMembers: existingUser.team_members || []
        } : null,
        error: checkError ? checkError.message : 'Nenhum erro'
      })

      // Converter team_members para o formato esperado pelo authContext
      if (existingUser && existingUser.team_members) {
        existingUser.teamMembers = existingUser.team_members.map((tm: any) => ({
          id: tm.id,
          userId: tm.user_id,
          teamId: tm.team_id
        }));
        delete existingUser.team_members; // Remover o campo antigo
      }

      if (checkError) {
        console.error('❌ ETAPA 1 - Erro ao verificar usuário na tabela:', checkError.message)
        throw new Error('Usuário não encontrado na tabela users')
      }

      if (!existingUser) {
        console.error('❌ ETAPA 1 - Usuário não encontrado na tabela users')
        throw new Error('Usuário não encontrado na tabela users')
      }

      console.log('✅ ETAPA 1 - Usuário encontrado na tabela, prosseguindo...')
      
      console.log('🔐 ETAPA 2: Tentando autenticar com Supabase Auth...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('📊 ETAPA 2 - Resposta do Supabase Auth:', {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          confirmed_at: data.user.email_confirmed_at
        } : 'Nenhum usuário',
        session: data.session ? {
          access_token: data.session.access_token ? 'Token presente' : 'Sem token',
          refresh_token: data.session.refresh_token ? 'Refresh token presente' : 'Sem refresh token'
        } : 'Nenhuma sessão',
        error: error ? error.message : 'Nenhum erro'
      })

      if (error) {
        console.error('❌ ETAPA 2 - Erro no Supabase Auth:', error.message)
        console.error('❌ Detalhes do erro:', error)
        throw new Error(error.message)
      }

      if (data.user) {
        console.log('✅ ETAPA 2 - Usuário autenticado com sucesso!')
        console.log('📊 ETAPA 3: Retornando dados do usuário...')
        console.log('📊 Dados que serão retornados:', {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          username: existingUser.username
        })
        return existingUser // Retornar dados da tabela users
      }

      console.log('⚠️ ETAPA 2 - Nenhum usuário retornado do Auth')
      return null
    } catch (error) {
      console.error('💥 ERRO GERAL NO LOGIN:', error)
      console.error('💥 Stack trace:', error instanceof Error ? error.stack : 'N/A')
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
      console.log('🚀 Iniciando processo de registro...')
      console.log('📝 Dados recebidos:', {
        name: userData.name,
        email: userData.email,
        username: userData.username,
        passwordLength: userData.password.length
      })

      // Verificar se o usuário já existe (com tratamento de erro melhorado)
      console.log('🔍 Verificando se usuário já existe...')
      const { data: existingUsers, error: checkError } = await supabase
        .from('users')
        .select('id, email, username')
        .or(`email.eq.${userData.email},username.eq.${userData.username}`)

      if (checkError) {
        console.error('❌ Erro ao verificar usuário existente:', checkError)
        // Continuar mesmo com erro na verificação, o Supabase Auth vai lidar com duplicatas
        console.log('⚠️ Continuando sem verificação prévia...')
      } else if (existingUsers && existingUsers.length > 0) {
        console.error('❌ Usuário já existe:', existingUsers[0])
        throw new Error('Email ou username já cadastrado')
      } else {
        console.log('✅ Usuário não existe, prosseguindo...')
      }

      // Criar usuário no Supabase Auth
      console.log('🔐 Criando usuário no Supabase Auth...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
      })

      console.log('📊 Resposta do Supabase Auth:', {
        user: authData.user ? 'Usuário criado' : 'Nenhum usuário',
        session: authData.session ? 'Sessão criada' : 'Nenhuma sessão',
        error: authError ? authError.message : 'Nenhum erro'
      })

      if (authError) {
        console.error('❌ Erro ao criar usuário no Auth:', authError.message)
        
        // Tratamento específico para rate limiting
        if (authError.message.includes('security purposes') || authError.message.includes('46 seconds')) {
          throw new Error('Muitas tentativas de cadastro. Aguarde alguns segundos e tente novamente.')
        }
        
        // Tratamento para email já cadastrado
        if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
          throw new Error('Este email já está cadastrado. Tente fazer login ou use outro email.')
        }
        
        throw new Error(authError.message)
      }

      if (authData.user) {
        console.log('✅ Usuário criado no Auth, criando registro na tabela users...')
        
        // Aguardar um pouco para garantir que o usuário está autenticado
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Criar registro na tabela users usando o ID do usuário autenticado
        const { data: newUserData, error: userError } = await supabase
          .from('users')
          .insert({
            id: authData.user.id,
            name: userData.name,
            email: userData.email,
            username: userData.username,
          })
          .select()
          .single()

        console.log('📊 Resposta da criação na tabela users:', {
          data: newUserData,
          error: userError ? userError.message : 'Nenhum erro'
        })

        if (userError) {
          console.error('❌ Erro ao criar dados do usuário na tabela:', userError.message)
          
          // Se for erro de RLS, tentar uma abordagem diferente
          if (userError.message.includes('row-level security')) {
            console.log('🔄 Tentando abordagem alternativa para RLS...')
            
            // Buscar o usuário recém-criado para retornar os dados
            const { data: existingUser, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('email', userData.email)
              .single()
            
            if (existingUser) {
              console.log('✅ Usuário encontrado na tabela, retornando dados existentes')
              return existingUser
            } else if (fetchError) {
              console.log('⚠️ Usuário criado no Auth mas não encontrado na tabela users')
              // Retornar dados básicos do usuário autenticado
              return {
                id: authData.user.id,
                name: userData.name,
                email: userData.email,
                username: userData.username,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }
            }
          }
          
          throw new Error(userError.message)
        }

        console.log('✅ Usuário criado com sucesso!')
        return newUserData
      }

      console.log('⚠️ Nenhum usuário retornado do Auth')
      return null
    } catch (error) {
      console.error('💥 Erro no registro:', error)
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
