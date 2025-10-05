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
  user_id: string  // Changed from number to string to match database schema
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
  created_at: string
  team?: Team
  user?: {
    id: string  // Changed from number to string to match database schema
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
      await this.addTeamMember(data.id, String(teamData.creator_id))

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
      console.log('🔍 supabaseTeams.deleteTeam: Deletando equipe', id);
      
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao deletar equipe:', error.message)
        throw new Error(error.message)
      }
      
      console.log('✅ Equipe deletada com sucesso');
    } catch (error) {
      console.error('❌ Erro ao deletar equipe:', error)
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
      console.log('🔍 supabaseTeams.removeTeamMember: Removendo membro', { teamId, userId });
      
      // Primeiro, buscar propriedades do usuário que serão afetadas
      console.log('🔍 Buscando propriedades do usuário na equipe...', { userId, teamId });
      const { data: userProperties, error: fetchError } = await supabase
        .from('properties')
        .select('id, user_id, title')
        .eq('user_id', String(userId))
        .eq('team_id', teamId);

      if (fetchError) {
        console.error('❌ Erro ao buscar propriedades do usuário:', fetchError.message);
        throw new Error(`Erro ao buscar propriedades do usuário: ${fetchError.message}`);
      }

      console.log('📊 Propriedades do usuário encontradas:', userProperties?.length || 0, userProperties);

      // Limpar team_id das propriedades do usuário que está sendo removido
      console.log('🔄 Limpando team_id das propriedades do usuário...', { userId, teamId });
      const { error: updatePropertiesError, count: updatedCount } = await supabase
        .from('properties')
        .update({ team_id: null })
        .eq('user_id', String(userId))
        .eq('team_id', teamId);

      if (updatePropertiesError) {
        console.error('❌ Erro ao limpar team_id das propriedades do usuário:', updatePropertiesError.message);
        throw new Error(`Erro ao limpar propriedades do usuário: ${updatePropertiesError.message}`);
      }
      
      console.log('✅ Team_id das propriedades do usuário limpo com sucesso. Propriedades atualizadas:', updatedCount);

      // Depois, remover o membro da equipe
      console.log('🔄 Removendo membro da equipe...');
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId)

      if (error) {
        console.error('❌ Erro ao remover membro:', error.message);
        if (error.code === '42501') {
          console.error('🔒 ERRO DE PERMISSÃO RLS - Execute o script fix-edit-team-rls.sql no Supabase');
          throw new Error('Erro de permissão RLS. Execute o script fix-edit-team-rls.sql no Supabase.');
        }
        throw new Error(error.message);
      }
      
      console.log('✅ Membro removido da equipe com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover membro:', error)
      throw error
    }
  },

  // Buscar convites de equipe por usuário
  async getTeamInvitationsByUser(userId: string): Promise<TeamInvitation[]> {
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
  async createTeamInvitation(teamId: number, userId: string): Promise<TeamInvitation> {
    try {
      console.log('🔍 supabaseTeams: Criando convite', { teamId, userId, userIdType: typeof userId });
      
      // Verificar se o usuário está autenticado
      const { data: { user: authUser } } = await supabase.auth.getUser();
      console.log('🔍 supabaseTeams: Usuário autenticado:', authUser?.id);
      
      const { data, error } = await supabase
        .from('team_invitations')
        .insert({
          team_id: teamId,
          user_id: String(userId), // Garantir que seja string
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
        console.error('Detalhes do erro:', error);
        throw new Error(error.message)
      }

      console.log('✅ supabaseTeams: Convite criado com sucesso:', data);
      return data
    } catch (error) {
      console.error('Erro ao criar convite:', error)
      throw error
    }
  },

  // Aceitar convite de equipe
  async acceptTeamInvitation(invitationId: number, userId: string): Promise<void> {
    try {
      console.log('🔍 supabaseTeams.acceptTeamInvitation: Aceitando convite', { invitationId, userId });
      
      // Buscar o convite
      const { data: invitation, error: fetchError } = await supabase
        .from('team_invitations')
        .select('*')
        .eq('id', invitationId)
        .eq('user_id', userId)
        .single()

      if (fetchError || !invitation) {
        console.error('❌ Convite não encontrado:', fetchError);
        throw new Error('Convite não encontrado')
      }

      console.log('✅ Convite encontrado:', invitation);

      // Atualizar status do convite
      const { error: updateError } = await supabase
        .from('team_invitations')
        .update({ status: 'ACCEPTED' })
        .eq('id', invitationId)

      if (updateError) {
        console.error('❌ Erro ao aceitar convite:', updateError.message)
        throw new Error(updateError.message)
      }

      console.log('✅ Status do convite atualizado para ACCEPTED');

      // Adicionar usuário à equipe
      await this.addTeamMember(invitation.team_id, userId)
      
      console.log('✅ Usuário adicionado à equipe:', invitation.team_id);

      // Atualizar team_id das propriedades do usuário
      console.log('🔄 Atualizando team_id das propriedades do usuário...');
      const { error: updatePropertiesError } = await supabase
        .from('properties')
        .update({ team_id: invitation.team_id })
        .eq('user_id', userId)
        .is('team_id', null);

      if (updatePropertiesError) {
        console.error('❌ Erro ao atualizar team_id das propriedades:', updatePropertiesError);
      } else {
        console.log('✅ Team_id das propriedades atualizado para o usuário');
      }
    } catch (error) {
      console.error('❌ Erro ao aceitar convite:', error)
      throw error
    }
  },

  // Rejeitar convite de equipe
  async rejectTeamInvitation(invitationId: number, userId: string): Promise<void> {
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
  },

  // Função utilitária para limpar propriedades órfãs (team_id que não existe mais)
  async cleanupOrphanedProperties(): Promise<void> {
    try {
      console.log('🔍 supabaseTeams.cleanupOrphanedProperties: Limpando propriedades órfãs...');
      
      // Buscar propriedades com team_id que não existe mais na tabela teams
      const { data: orphanedProperties, error: fetchError } = await supabase
        .from('properties')
        .select(`
          id,
          user_id,
          title,
          team_id,
          team:teams(id)
        `)
        .not('team_id', 'is', null);

      if (fetchError) {
        console.error('❌ Erro ao buscar propriedades órfãs:', fetchError.message);
        throw new Error(fetchError.message);
      }

      // Filtrar propriedades onde team é null (equipe não existe mais)
      const propertiesToClean = orphanedProperties?.filter(prop => !prop.team) || [];
      
      console.log('📊 Propriedades órfãs encontradas:', propertiesToClean.length, propertiesToClean);

      if (propertiesToClean.length === 0) {
        console.log('✅ Nenhuma propriedade órfã encontrada');
        return;
      }

      // Limpar team_id das propriedades órfãs
      const { error: updateError, count } = await supabase
        .from('properties')
        .update({ team_id: null })
        .in('id', propertiesToClean.map(p => p.id));

      if (updateError) {
        console.error('❌ Erro ao limpar propriedades órfãs:', updateError.message);
        throw new Error(updateError.message);
      }

      console.log('✅ Propriedades órfãs limpas com sucesso. Propriedades atualizadas:', count);
    } catch (error) {
      console.error('❌ Erro ao limpar propriedades órfãs:', error);
      throw error;
    }
  }
}
