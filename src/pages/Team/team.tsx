import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TeamContainer, CreateTeamButton, TeamImage, TeamCard, TeamDetails, TeamMembers, TeamName, UserTag, EditIcon } from './styles';
import { useAuth } from '../../services/authContext';
import { FaSignOutAlt, FaEdit } from 'react-icons/fa';

interface Team {
  id: number;
  name: string;
  members: { userId: number; name: string; email: string }[]; // Alterado para members
  imageUrl?: string;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}

const Team = () => {
  const { user, setUser } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/teams`);
        console.log('Dados da API:', response.data); // Verifique os dados retornados
        setTeams(response.data || []);
      } catch (error) {
        console.error('Erro ao buscar equipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [user]);

  const handleCreateTeam = () => {
    navigate('/create-team');
  };

  const userHasTeam = user?.id && Array.isArray(teams) && teams.some(team =>
    Array.isArray(team.members) && team.members.some(member => member.userId === user.id)
  );

  const sortedTeams = Array.isArray(teams) ? [...teams].sort((a, b) => {
    const aIsUserTeam = Array.isArray(a.members) && a.members.some(member => member.userId === user?.id);
    const bIsUserTeam = Array.isArray(b.members) && b.members.some(member => member.userId === user?.id);
    return bIsUserTeam ? 1 : aIsUserTeam ? -1 : 0;
  }) : [];

  const handleLeaveTeam = async (teamId: number) => {
    const confirmLeave = window.confirm("Você tem certeza que deseja sair da equipe?");

    if (confirmLeave) {
      try {
        const userId = user?.id;

        if (!userId) {
          console.error('Usuário não encontrado');
          return;
        }

        const response = await axios.post(
          `http://localhost:3333/teams/${teamId}/leave`,
          { userId }
        );

        setTeams(prevTeams =>
          prevTeams.map(team =>
            team.id === teamId
              ? {
                  ...team,
                  members: team.members.filter(member => member.userId !== userId),
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
          console.log("Usuário atualizado após sair da equipe:", updatedUser);
        }

        console.log(response.data.message);
      } catch (error) {
        console.error('Erro ao deixar a equipe:', error);
      }
    } else {
      console.log("Ação cancelada");
      alert('Ocorreu um erro ao tentar sair da equipe. Tente novamente mais tarde.');
    }
  };

  return (
    <TeamContainer>
      <h2>Equipes</h2>

      {!loading && !userHasTeam && (
        <CreateTeamButton onClick={handleCreateTeam}>Criar Equipe</CreateTeamButton>
      )}

      <div>
        {loading ? (
          <p>Carregando equipes...</p>
        ) : Array.isArray(sortedTeams) && sortedTeams.length > 0 ? (
          sortedTeams.map((team) => {
            const isUserInTeam = Array.isArray(team.members) && team.members.some(
              (member) => member.userId === user?.id
            );

            const isTeamOwner = team.creatorId === user?.id;

            return (
              <TeamCard key={team.id}>
                {team.imageUrl && (
                  <TeamImage src={`http://localhost:3333${team.imageUrl}`} alt={`Imagem da equipe ${team.name}`} />
                )}
                <TeamDetails>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TeamName>{team.name}</TeamName>
                    {isTeamOwner && (
                      <EditIcon onClick={() => navigate(`/edit-team/${team.id}`)}>
                        <FaEdit />
                      </EditIcon>
                    )}
                    {isUserInTeam && !isTeamOwner && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{ cursor: 'pointer', color: 'red' }}
                          onClick={() => handleLeaveTeam(team.id)}
                        >
                          Sair
                        </span>
                        <FaSignOutAlt
                          onClick={() => handleLeaveTeam(team.id)}
                          style={{ cursor: 'pointer', fontSize: '20px', color: 'red' }}
                        />
                      </div>
                    )}
                  </div>
                  {isUserInTeam && <UserTag>Sua equipe!</UserTag>}
                  <TeamMembers>
                    {Array.isArray(team.members) && team.members.length > 0 ? (
                      <ul>
                        {team.members.map((member) => (
                          <li key={member.userId}>
                            {member.name || 'Carregando...'}
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
          <p>Não há equipes para exibir.</p>
        )}
      </div>
    </TeamContainer>
  );
};

export default Team;