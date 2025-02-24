import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TeamContainer, CreateTeamButton, TeamImage, TeamCard, TeamDetails, TeamMembers, TeamName, UserTag, EditIcon } from './styles';
import { useAuth } from '../../services/authContext';
import { FaSignOutAlt, FaEdit } from 'react-icons/fa';

interface Member {
  id: number;
  userId: number;
  name?: string;
}

interface Team {
  id: number;
  name: string;
  members: Member[];
  imageUrl?: string;
  creatorId: number;
}

const Team = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [membersNames, setMembersNames] = useState<{ [key: number]: string }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const fetchTeams = async () => {
      try {
        const response = await axios.get(`https://server-2-production.up.railway.app/teams`);
        setTeams(response.data);
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

  const userHasTeam = user?.id && teams.some(team =>
    team.members.some(member => member.userId === user.id)
  );

  const getMemberName = async (userId: number) => {
    try {
      const response = await axios.get(`https://server-2-production.up.railway.app/users/${userId}`);
      return response.data.name;
    } catch (error) {
      console.error('Erro ao buscar nome do membro:', error);
      return 'Desconhecido';
    }
  };

  useEffect(() => {
    teams.forEach((team) => {
      team.members.forEach(async (member) => {
        const name = await getMemberName(member.userId);
        setMembersNames((prevNames) => {
          const updatedNames = { ...prevNames, [member.id]: name };
          return updatedNames;
        });
      });
    });
  }, [teams]);

  const sortedTeams = [...teams].sort((a, b) => {
    const aIsUserTeam = a.members.some(member => member.userId === user?.id);
    const bIsUserTeam = b.members.some(member => member.userId === user?.id);
    return bIsUserTeam ? 1 : aIsUserTeam ? -1 : 0;
  });

  const handleLeaveTeam = async (teamId: number) => {
    const confirmLeave = window.confirm("Você tem certeza que deseja sair da equipe?");
    
    if (confirmLeave) {
      try {
        const userId = user?.id; // Obtém o ID do usuário do contexto
  
        if (!userId) {
          console.error('Usuário não encontrado');
          return;
        }
  
        const response = await axios.post(
          `https://server-2-production.up.railway.app/teams/${teamId}/leave`,
          { userId }, // Envia o userId diretamente no corpo da requisição
        );
        
        setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
        console.log(response.data.message); // Mensagem de sucesso
      } catch (error) {
        console.error('Erro ao deixar a equipe:', error);
      }
    } else {
      console.log("Ação cancelada");
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
        ) : sortedTeams.length > 0 ? (
          sortedTeams.map((team) => {
            const isUserInTeam = team.members.some(
              (member) => member.userId === user?.id
            );

            const isTeamOwner = team.creatorId === user?.id;

            return (
              <TeamCard key={team.id}>
                {team.imageUrl && (
                  <TeamImage src={`https://server-2-production.up.railway.app${team.imageUrl}`} alt={`Imagem da equipe ${team.name}`} />
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
                      <FaSignOutAlt
                        onClick={() => handleLeaveTeam(team.id)}
                        style={{ cursor: 'pointer', fontSize: '20px', color: 'red' }}
                      />
                    )}
                  </div>
                  {isUserInTeam && <UserTag>Sua equipe!</UserTag>}
                  <TeamMembers>
                    {Array.isArray(team.members) && team.members.length > 0 ? (
                      <ul>
                        {team.members.map((member) => (
                          <li key={member.id}>
                            {membersNames[member.id] || 'Carregando...'}
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
