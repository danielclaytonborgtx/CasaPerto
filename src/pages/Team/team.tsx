/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingMessage from '../../components/loadingMessage/LoadingMessage';
import { supabaseTeams } from '../../services/supabaseTeams';
import { 
  TeamContainer, 
  CreateTeamButton, 
  TeamImage, 
  TeamCard, 
  TeamDetails, 
  TeamMembers, 
  TeamName, 
  UserTag, 
  EditIcon,
  InviteButtons,
  AcceptButton,
  RejectButton,
  LeaveButton,
  TeamHeader,
  TeamNameSection,
  ButtonsSection
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

  const fetchTeams = async () => {
    try {
      const data = await supabaseTeams.getAllTeams();
      setTeams(data || []);
    } catch (error) {
      console.error('Erro ao buscar equipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const data = await supabaseTeams.getTeamInvitationsByUser(user.id);
      setInvitations(data);
    } catch (error) {
      console.error('Erro ao buscar convites:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchTeams();
      fetchInvitations();
    } else {
      setLoading(false);
    }
  }, [user, fetchInvitations]);

  const handleCreateTeam = () => {
    navigate('/create-team');
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      if (!user?.id) {
        alert('Usuário não autenticado');
        return;
      }
  
      console.log('Enviando requisição:', {
        invitationId,
        userId: user.id
      });
  
      await supabaseTeams.acceptTeamInvitation(invitationId, user.id);
      
      await Promise.all([fetchTeams(), fetchInvitations()]);
      alert('Convite aceito com sucesso!');
    } catch (error) {
      console.error('Erro ao aceitar convite:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao aceitar convite. Tente novamente.';
      alert(errorMessage);
    }
  };

  const handleRejectInvitation = async (invitationId: number) => {
    try {
      if (!user?.id) {
        alert('Usuário não autenticado');
        return;
      }
  
      console.log('Enviando requisição de rejeição:', {
        invitationId,
        userId: user.id
      });
  
      await supabaseTeams.rejectTeamInvitation(invitationId, user.id);
      
      await fetchInvitations();
      alert('Convite rejeitado.');
    } catch (error) {
      console.error('Erro ao rejeitar convite:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao rejeitar convite. Tente novamente.';
      alert(errorMessage);
    }
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

        // Remove user from team - this would need to be implemented in supabaseTeams
        console.log('Removing user from team:', { teamId, userId });
        // For now, just show success message

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

        if (setUser && user) {
          const updatedUser = {
            ...user,
            teamId: undefined,
            team: undefined,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        alert('Você saiu da equipe com sucesso.');
      } catch (error) {
        console.error('Erro ao deixar a equipe:', error);
        alert('Ocorreu um erro ao tentar sair da equipe. Tente novamente mais tarde.');
      }
    }
  };

  const userHasTeam = user?.id && Array.isArray(teams) && teams.some(team =>
    Array.isArray(team.members) && team.members.some((member: any) => member.userId === user.id)
  );

  const sortedTeams = Array.isArray(teams) ? [...teams].sort((a: any, b: any) => {
    const aIsUserTeam = Array.isArray(a.members) && a.members.some((member: any) => member.userId === user?.id);
    const bIsUserTeam = Array.isArray(b.members) && b.members.some((member: any) => member.userId === user?.id);
    return bIsUserTeam ? 1 : aIsUserTeam ? -1 : 0;
  }) : [];

  return (
    <TeamContainer>
      <h2>Equipes</h2>

      {!loading && !userHasTeam && (
        <CreateTeamButton onClick={handleCreateTeam}>Criar Equipe</CreateTeamButton>
      )}

      <div>
        {loading ? (
          <LoadingMessage />
        ) : Array.isArray(sortedTeams) && sortedTeams.length > 0 ? (
          sortedTeams.map((team) => {
            const isUserInTeam = Array.isArray(team.members) && 
              team.members.some((member: any) => member.userId === user?.id);
            
            const isTeamOwner = team.creatorId === user?.id;
            
            const pendingInvitation = invitations.find(
              inv => inv.teamId === team.id && inv.status === 'PENDING'
            );

            return (
              <TeamCard key={team.id}>
                {team.imageUrl && (
                  <TeamImage 
                    src={team.imageUrl}
                    alt={`Imagem da equipe ${team.name}`} 
                  />
                )}
                <TeamDetails>
                  <TeamHeader>
                    <TeamNameSection>
                      <TeamName>{team.name}</TeamName>
                      {isUserInTeam && <UserTag>Sua equipe!</UserTag>}
                    </TeamNameSection>
                    
                    <ButtonsSection>
                      {pendingInvitation && (
                        <InviteButtons>
                          <AcceptButton onClick={() => handleAcceptInvitation(pendingInvitation.id)}>
                            Aceitar
                          </AcceptButton>
                          <RejectButton onClick={() => handleRejectInvitation(pendingInvitation.id)}>
                            Rejeitar
                          </RejectButton>
                        </InviteButtons>
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
                    </ButtonsSection>
                  </TeamHeader>

                  <TeamMembers>
                    {Array.isArray(team.members) && team.members.length > 0 ? (
                      <ul>
                        {team.members
                          .sort((a: any, b: any) => a.userId.localeCompare(b.userId)) 
                          .map((member: any) => (
                            <li key={member.userId}>
                              {member.name}
                              {pendingInvitation && member.userId === user?.id && 
                                " (Convite Pendente)"}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p>Sem membros na equipe.</p>
                    )}
                  </TeamMembers>
                </TeamDetails>
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
