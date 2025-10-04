import { supabase } from '../lib/supabase'

export interface Team {
  id: number
  name: string
  image_url?: string
  created_by: string
  created_at: string
  updated_at: string
  members?: TeamMember[]
}

export interface TeamMember {
  id: number
  user_id: string
  team_id: number
  role: string
  created_at: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export interface TeamInvitation {
  id: number
  team_id: number
  user_id: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  created_at: string
  team?: Team
  user?: {
    id: number
    name: string
    email: string
  }
}

export const supabaseTeams = {
  // Buscar todas as equipes
  async getAllTeams(): Promise<Team[]> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          members:team_members(
            *,
            user:users(id, name, email)
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar equipes:', error.message)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar equipes:', error)
      throw error
    }
  },

  // Buscar equipe por ID
  async getTeamById(id: number): Promise<Team | null> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select(`
          *,
          members:team_members(
            *,
            user:users(id, name, email)
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        console.error('Erro ao buscar equipe:', error.message)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar equipe:', error)
      return null
    }
  },

  // Buscar membros de uma equipe
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          *,
          user:users(id, name, email)
        `)
        .eq('team_id', teamId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Erro ao buscar membros da equipe:', error.message)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar membros da equipe:', error)
      throw error
    }
  },

  // Criar nova equipe
  async createTeam(teamData: {
    name: string
    image_url?: string
    creator_id: number
  }): Promise<Team> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert({
          ...teamData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao criar equipe:', error.message)
        throw new Error(error.message)
      }

      // Adicionar o criador como membro da equipe
      await this.addTeamMember(data.id, teamData.creator_id)

      return data
    } catch (error) {
      console.error('Erro ao criar equipe:', error)
      throw error
    }
  },

  // Atualizar equipe
  async updateTeam(id: number, updates: {
    name?: string
    image_url?: string
  }): Promise<Team> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        console.error('Erro ao atualizar equipe:', error.message)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erro ao atualizar equipe:', error)
      throw error
    }
  },

  // Deletar equipe
  async deleteTeam(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Erro ao deletar equipe:', error.message)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erro ao deletar equipe:', error)
      throw error
    }
  },

  // Adicionar membro à equipe
  async addTeamMember(teamId: number, userId: string): Promise<TeamMember> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId,
          role: 'MEMBER',
          created_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) {
        console.error('Erro ao adicionar membro:', error.message)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erro ao adicionar membro:', error)
      throw error
    }
  },

  // Remover membro da equipe
  async removeTeamMember(teamId: number, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao remover membro:', error.message)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erro ao remover membro:', error)
      throw error
    }
  },

  // Buscar convites de equipe por usuário
  async getTeamInvitationsByUser(userId: number): Promise<TeamInvitation[]> {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .select(`
          *,
          team:teams(*),
          user:users(id, name, email)
        `)
        .eq('user_id', userId)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar convites:', error.message)
        throw new Error(error.message)
      }

      return data || []
    } catch (error) {
      console.error('Erro ao buscar convites:', error)
      throw error
    }
  },

  // Criar convite para equipe
  async createTeamInvitation(teamId: number, userId: number): Promise<TeamInvitation> {
    try {
      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          user_id: userId,
          status: 'PENDING',
          created_at: new Date().toISOString(),
        })
        .select(`
          *,
          team:teams(*),
          user:users(id, name, email)
        `)
        .single()

      if (error) {
        console.error('Erro ao criar convite:', error.message)
        throw new Error(error.message)
      }

      return data
    } catch (error) {
      console.error('Erro ao criar convite:', error)
      throw error
    }
  },

  // Aceitar convite de equipe
  async acceptTeamInvitation(invitationId: number, userId: number): Promise<void> {
    try {
      // Buscar o convite
      const { data: invitation, error: fetchError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('id', invitationId)
        .eq('user_id', userId)
        .single()

      if (fetchError || !invitation) {
        throw new Error('Convite não encontrado')
      }

      // Atualizar status do convite
      const { error: updateError } = await supabase
        .from('team_invitations')
        .update({ status: 'ACCEPTED' })
        .eq('id', invitationId)

      if (updateError) {
        console.error('Erro ao aceitar convite:', updateError.message)
        throw new Error(updateError.message)
      }

      // Adicionar usuário à equipe
      await this.addTeamMember(invitation.team_id, userId)
    } catch (error) {
      console.error('Erro ao aceitar convite:', error)
      throw error
    }
  },

  // Rejeitar convite de equipe
  async rejectTeamInvitation(invitationId: number, userId: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('team_invitations')
        .update({ status: 'REJECTED' })
        .eq('id', invitationId)
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao rejeitar convite:', error.message)
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Erro ao rejeitar convite:', error)
      throw error
    }
  }
}
