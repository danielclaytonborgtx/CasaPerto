/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingMessage from '../../components/loadingMessage/LoadingMessage';
import { supabaseTeams } from '../../services/supabaseTeams';
import { 
  TeamContainer, 
  CreateTeamButton, 
  TeamImage, 
  TeamCard, 
  TeamMembers, 
  TeamName, 
  UserTag, 
  EditIcon,
  AcceptButton,
  RejectButton,
  LeaveButton
} from './styles';
import { useAuth } from '../../services/authContext';
import { FaSignOutAlt, FaEdit } from 'react-icons/fa';

interface TeamInvitation {
  id: number;
  teamId: number;
  userId: string; // UUID
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

interface Team {
  id: number;
  name: string;
  members: { userId: string; name: string; email: string }[]; // UUID
  imageUrl?: string;
  creatorId: string; // UUID
  createdAt: string;
  updatedAt: string;
  invitations?: TeamInvitation[];
}

const Team = () => {
  const { user, setUser } = useAuth();
  const [teams, setTeams] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const fetchTeamsRef = useRef<() => Promise<void>>();
  const fetchInvitationsRef = useRef<() => Promise<void>>();
  const isUpdatingUserRef = useRef<boolean>(false);
  
  const fetchTeams = useCallback(async () => {
    try {
      console.log('🔍 Team: Buscando equipes...');
      const data = await supabaseTeams.getAllTeams();
      console.log('✅ Team: Equipes carregadas:', data);
      setTeams(data || []);
    } catch (error) {
      console.error('❌ Team: Erro ao buscar equipes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualizar a referência sempre que fetchTeams mudar
  fetchTeamsRef.current = fetchTeams;

  const fetchInvitations = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      console.log('🔍 Team: Buscando convites para usuário', user.id);
      const data = await supabaseTeams.getTeamInvitationsByUser(String(user.id));
      console.log('✅ Team: Convites carregados', data);
      setInvitations(data);
    } catch (error) {
      console.error('❌ Team: Erro ao buscar convites:', error);
    }
  }, [user?.id]);

  // Atualizar a referência sempre que fetchInvitations mudar
  fetchInvitationsRef.current = fetchInvitations;

  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      if (!user?.id) {
        alert('Usuário não autenticado');
        return;
      }
      
      console.log('🔍 Team: Aceitando convite', invitationId);
      await supabaseTeams.acceptTeamInvitation(invitationId, String(user.id));
      console.log('✅ Team: Convite aceito com sucesso');
      
      // Excluir outros convites pendentes (usuário não pode estar em múltiplas equipes)
      console.log('🧹 Team: Removendo outros convites pendentes...');
      const otherInvitations = invitations.filter(inv => inv.id !== invitationId);
      for (const otherInvitation of otherInvitations) {
        try {
          await supabaseTeams.rejectTeamInvitation(otherInvitation.id, String(user.id));
          console.log(`✅ Team: Convite ${otherInvitation.id} removido`);
        } catch (error) {
          console.error(`❌ Team: Erro ao remover convite ${otherInvitation.id}:`, error);
        }
      }
      
      // Atualizar dados do usuário após aceitar convite
      console.log('🔄 Team: Atualizando dados do usuário após aceitar convite...');
      const { supabase } = await import('../../lib/supabase');
      
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
        console.error('❌ Team: Erro ao buscar dados atualizados:', userError);
      } else if (updatedUser) {
        // Converter team_members para o formato esperado
        if (updatedUser.team_members) {
          updatedUser.teamMembers = updatedUser.team_members.map((tm: any) => ({
            id: tm.id,
            userId: tm.user_id,
            teamId: tm.team_id
          }));
          delete updatedUser.team_members;
        }
        
        console.log('✅ Team: Dados atualizados do usuário:', updatedUser);
        
        // Atualizar o usuário no contexto
        if (setUser) {
          isUpdatingUserRef.current = true; // Flag para evitar loop
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          console.log('✅ Team: Usuário atualizado no contexto e localStorage');
        }
        
        // Atualizar dados localmente sem recarregar a página
        console.log('🔄 Team: Atualizando dados localmente...');
        fetchTeamsRef.current?.();
        fetchInvitationsRef.current?.();
      }
      
      alert('Convite aceito! Você agora faz parte da equipe.');
    } catch (error) {
      console.error('❌ Team: Erro ao aceitar convite:', error);
      alert('Erro ao aceitar convite. Tente novamente.');
    }
  };

  const handleRejectInvitation = async (invitationId: number) => {
    try {
      if (!user?.id) {
        alert('Usuário não autenticado');
        return;
      }
      
      console.log('🔍 Team: Rejeitando convite', invitationId);
      await supabaseTeams.rejectTeamInvitation(invitationId, String(user.id));
      console.log('✅ Team: Convite rejeitado com sucesso');
      
      // Atualizar lista de convites
      fetchInvitationsRef.current?.();
      
      alert('Convite rejeitado.');
    } catch (error) {
      console.error('❌ Team: Erro ao rejeitar convite:', error);
      alert('Erro ao rejeitar convite. Tente novamente.');
    }
  };

  useEffect(() => {
    // Evitar execução durante atualização do usuário
    if (isUpdatingUserRef.current) {
      isUpdatingUserRef.current = false;
      return;
    }
    
    console.log('🔄 Team: useEffect principal executado, user?.id:', user?.id);
    
    if (user?.id) {
      fetchTeamsRef.current?.();
      fetchInvitationsRef.current?.();
    } else {
      setLoading(false);
    }
  }, [user?.id]);

  // Atualizar equipes quando a página ganha foco (SEM interval por enquanto)
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) {
        console.log('🔄 Team: Página ganhou foco, atualizando equipes...');
        fetchTeamsRef.current?.();
      }
    };

    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.id]);

  const handleCreateTeam = () => {
    navigate('/create-team');
  };


  const handleLeaveTeam = async (teamId: number) => {
    const confirmLeave = window.confirm("Você tem certeza que deseja sair da equipe?");

    if (confirmLeave) {
      try {
        const userId = user?.id;

        if (!userId) {
          console.error('Usuário não encontrado');
          return;
        }

        console.log('🔍 Team: Removendo usuário da equipe:', { teamId, userId, userIdType: typeof userId });
        
        // Remover usuário da equipe usando Supabase
        await supabaseTeams.removeTeamMember(teamId, String(userId));
        
        console.log('✅ Team: Usuário removido da equipe com sucesso');

        // NOVA FUNCIONALIDADE: Limpar team_id das propriedades do usuário
        console.log('🧹 Team: Limpando team_id das propriedades do usuário...');
        const { supabase } = await import('../../lib/supabase');
        
        const { error: updatePropertiesError } = await supabase
          .from('properties')
          .update({ team_id: null })
          .eq('user_id', userId)
          .eq('team_id', teamId);

        if (updatePropertiesError) {
          console.error('❌ Team: Erro ao limpar team_id das propriedades:', updatePropertiesError);
          // Não falhar o processo por causa disso, apenas logar o erro
        } else {
          console.log('✅ Team: team_id das propriedades limpo com sucesso');
        }

        // Atualizar estado local
        setTeams(prevTeams =>
          prevTeams.map(team =>
            team.id === teamId
              ? {
                  ...team,
                  members: team.members.filter((member: any) => member.userId !== userId),
                }
              : team
          )
        );

        // Atualizar dados do usuário - remover teamMembers
        if (setUser && user) {
          const updatedUser = {
            ...user,
            teamMembers: [], // Limpar array de teamMembers
            teamId: undefined,
            team: undefined,
          };
          isUpdatingUserRef.current = true; // Flag para evitar loop
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          console.log('✅ Team: Dados do usuário atualizados - teamMembers removidos');
        }

        // Atualizar dados localmente sem recarregar a página
        console.log('🔄 Team: Atualizando dados localmente...');
        fetchTeamsRef.current?.();
        fetchInvitationsRef.current?.();

        alert('Você saiu da equipe com sucesso.');
        console.log('✅ Team: Processo de sair da equipe concluído');
      } catch (error) {
        console.error('❌ Team: Erro ao deixar a equipe:', error);
        console.error('❌ Team: Detalhes do erro:', {
          message: error instanceof Error ? error.message : 'Erro desconhecido',
          teamId,
          userId: user?.id
        });
        alert('Ocorreu um erro ao tentar sair da equipe. Tente novamente mais tarde.');
      }
    }
  };

  const userHasTeam = user?.id && Array.isArray(teams) && teams.some(team =>
    Array.isArray(team.members) && team.members.some((member: any) => {
      const isMember = member.user_id === user.id || member.userId === user.id;
      return isMember;
    })
  );

  // Verificar se usuário tem convites pendentes
  const hasPendingInvitations = invitations.length > 0;
  
  // console.log('🔍 Team: Verificando se usuário tem equipe:', {
  //   userId: user?.id,
  //   teamsCount: teams.length,
  //   userHasTeam,
  //   teams: teams.map(team => ({
  //     id: team.id,
  //     name: team.name,
  //     members: team.members?.map((m: any) => ({ userId: m.userId, name: m.name }))
  //   }))
  // });

  const sortedTeams = Array.isArray(teams) ? [...teams].sort((a: any, b: any) => {
    const aIsUserTeam = Array.isArray(a.members) && a.members.some((member: any) => 
      member.user_id === user?.id || member.userId === user?.id
    );
    const bIsUserTeam = Array.isArray(b.members) && b.members.some((member: any) => 
      member.user_id === user?.id || member.userId === user?.id
    );
    
    // Equipe do usuário sempre no topo
    if (aIsUserTeam && !bIsUserTeam) return -1; // a vem antes de b
    if (!aIsUserTeam && bIsUserTeam) return 1;  // b vem antes de a
    return 0; // mantém ordem original se ambos ou nenhum são do usuário
  }) : [];

  return (
    <TeamContainer>
      <h2>Equipes</h2>

      {!loading && !userHasTeam && !hasPendingInvitations && (
        <CreateTeamButton onClick={handleCreateTeam}>Criar Equipe</CreateTeamButton>
      )}

      {/* Mensagem informativa quando há convites pendentes */}
      {!loading && !userHasTeam && hasPendingInvitations && (
        <div style={{
          backgroundColor: '#e3f2fd',
          border: '1px solid #2196f3',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          color: '#1976d2'
        }}>
          <strong>📧 Você tem convites pendentes!</strong>
          <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
            Responda aos convites antes de criar uma nova equipe.
          </p>
        </div>
      )}

      {/* Convites Pendentes */}
      {!loading && invitations.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#007bff', marginBottom: '10px' }}>📧 Convites Pendentes</h3>
          {invitations.map((invitation) => (
            <div key={invitation.id} style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#f9f9f9'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{invitation.team?.name}</strong>
                  <p style={{ margin: '5px 0', color: '#666' }}>
                    Convite para participar da equipe
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleAcceptInvitation(invitation.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ✅ Aceitar
                  </button>
                  <button
                    onClick={() => handleRejectInvitation(invitation.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    ❌ Rejeitar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div>
        {loading ? (
          <LoadingMessage />
        ) : Array.isArray(sortedTeams) && sortedTeams.length > 0 ? (
          sortedTeams.map((team) => {
            // console.log('🔍 Team: Dados da equipe:', {
            //   id: team.id,
            //   name: team.name,
            //   image_url: team.image_url,
            //   created_by: team.created_by,
            //   members: team.members,
            //   user_id: user?.id
            // });
            
            const isUserInTeam = Array.isArray(team.members) && 
              team.members.some((member: any) => member.user_id === user?.id);
            
            const isTeamOwner = team.created_by === user?.id;
            
            // console.log('🔍 Team: Verificações:', {
            //   isUserInTeam,
            //   isTeamOwner,
            //   user_id: user?.id,
            //   created_by: team.created_by
            // });
            
            const pendingInvitation = invitations.find(
              inv => inv.teamId === team.id && inv.status === 'PENDING'
            );

            return (
              <TeamCard key={team.id} style={{
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '20px',
                  width: '100%'
                }}>
                  {/* Lado Esquerdo: Logo, Nome, "Sua equipe!" e Botões */}
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    minWidth: '120px',
                    gap: '10px'
                  }}>
                    {team.image_url && (
                      <TeamImage 
                        src={team.image_url}
                        alt={`Imagem da equipe ${team.name}`} 
                        style={{ width: '60px', height: '60px' }}
                      />
                    )}
                    
                    <div style={{ textAlign: 'center' }}>
                      <TeamName style={{ fontSize: '16px', marginBottom: '5px' }}>{team.name}</TeamName>
                      {isUserInTeam && <UserTag>Sua equipe!</UserTag>}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                      {pendingInvitation && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <AcceptButton onClick={() => handleAcceptInvitation(pendingInvitation.id)}>
                            Aceitar
                          </AcceptButton>
                          <RejectButton onClick={() => handleRejectInvitation(pendingInvitation.id)}>
                            Rejeitar
                          </RejectButton>
                        </div>
                      )}
                      {isUserInTeam && !isTeamOwner && (
                        <LeaveButton onClick={() => handleLeaveTeam(team.id)}>
                          <span>Sair</span>
                          <FaSignOutAlt />
                        </LeaveButton>
                      )}
                      {isTeamOwner && (
                        <EditIcon onClick={() => navigate(`/edit-team/${team.id}`)}>
                          <FaEdit />
                        </EditIcon>
                      )}
                    </div>
                  </div>

                  {/* Lado Direito: Lista de Participantes */}
                  <div style={{ 
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                  }}>
                    <h4 style={{ 
                      margin: '0 0 10px 0', 
                      fontSize: '14px', 
                      color: '#666',
                      fontWeight: 'bold'
                    }}>
                      Participantes:
                    </h4>
                    <TeamMembers>
                      {Array.isArray(team.members) && team.members.length > 0 ? (
                        <ul style={{ 
                          listStyle: 'none', 
                          padding: 0, 
                          margin: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '5px'
                        }}>
                          {team.members
                            .sort((a: any, b: any) => a.user?.name?.localeCompare(b.user?.name) || 0) 
                            .map((member: any, index: number) => (
                              <li key={member.id || member.user_id || index} style={{
                                padding: '5px 10px',
                                backgroundColor: '#ffffff',
                                borderRadius: '4px',
                                fontSize: '14px',
                                border: '1px solid #dee2e6',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                              }}>
                                {member.user?.name || member.name}
                                {pendingInvitation && member.user_id === user?.id && 
                                  " (Convite Pendente)"}
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                          Sem membros na equipe.
                        </p>
                      )}
                    </TeamMembers>
                  </div>
                </div>
              </TeamCard>
            );
          })
        ) : (
          <p>Nenhuma equipe encontrada.</p>
        )}
      </div>
    </TeamContainer>
  );
};

export default Team;
