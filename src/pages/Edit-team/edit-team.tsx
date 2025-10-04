import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { supabaseStorage } from "../../services/supabaseStorage";
import { supabaseTeams } from "../../services/supabaseTeams";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import {
  Container,
  Input,
  Button,
  BrokerList,
  BrokerItem,
  AddedBrokerList,
  AddBrokerButton,
  LeftColumn,
  ListsContainer,
  RightColumn,
  TeamIcon,
  TeamImage,
  EditButton,
  DeleteTeamButton,
} from "./styles";

import { FaPlus, FaMinus } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

import { useAuth, User } from "../../services/authContext";

interface TeamMember {
  id: number;
  userId: string;
  name: string;
  email: string;
}

interface TeamData {
  name: string;
  members: TeamMember[];
  imageUrl: string | null;
}

interface PendingInvite {
  userId: string;
  name: string;
  email: string;
}

const EditTeam: React.FC = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [teamName, setTeamName] = useState("");
  const [brokers, setBrokers] = useState<TeamMember[]>([]);
  const [brokerName, setBrokerName] = useState("");
  const [availableBrokers, setAvailableBrokers] = useState<User[]>([]);
  const [teamImage, setTeamImage] = useState<string | null>(null);
  const [imageInputRef, setImageInputRef] = useState<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);

  const fetchTeam = useCallback(async () => {
    if (isDeleted) return;
    try {
      console.log('🔍 EditTeam: Buscando dados da equipe', id);
      const team = await supabaseTeams.getTeamById(Number(id));
      
      if (!team) {
        console.log('❌ EditTeam: Equipe não encontrada');
        navigate("/team");
        return;
      }
      
      console.log('✅ EditTeam: Equipe carregada', team);
      setTeamName(team.name);
      setTeamImage(team.image_url || null);
      
      // Buscar membros da equipe
      console.log('🔍 EditTeam: Verificando se getTeamMembers existe:', typeof supabaseTeams.getTeamMembers);
      const members = await supabaseTeams.getTeamMembers(Number(id));
      console.log('✅ EditTeam: Membros carregados', members);
      
      // Converter para o formato esperado
      const brokers = members.map(member => ({
        id: member.user_id,
        userId: member.user_id,
        name: member.user?.name || 'Nome não encontrado',
        email: member.user?.email || '',
        role: member.role
      }));
      
      setBrokers(brokers);
    } catch (error) {
      console.error("❌ EditTeam: Erro ao buscar dados da equipe:", error);
      navigate("/team");
    }
  }, [id, navigate, isDeleted]);

  const fetchBrokers = useCallback(async () => {
    try {
      console.log('🔍 EditTeam: Buscando usuários disponíveis');
      const { data: users, error } = await supabase
        .from('users')
        .select('id, name, username, email')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ EditTeam: Erro ao buscar usuários:', error);
        return;
      }

      console.log('✅ EditTeam: Usuários carregados', users);
      const validBrokers = (users || []).filter((broker) => broker.id && broker.name);
      setAvailableBrokers(validBrokers);
    } catch (error) {
      console.error("❌ EditTeam: Erro ao buscar corretores:", error);
    }
  }, []);

  useEffect(() => {
    if (id && !isDeleted) {
      fetchTeam();
    }
    fetchBrokers();
  }, [id, isDeleted, fetchBrokers, fetchTeam]);

  const handleAddBroker = async (user: User) => {
    try {
      console.log('🔍 EditTeam: Adicionando membro à equipe', { userId: user.id, teamId: id });
      
      // Adicionar membro diretamente à equipe
      await supabaseTeams.addTeamMember(Number(id), user.id);
      
      // Adicionar à lista de membros
      const newMember = {
        id: user.id,
        userId: user.id,
        name: user.name,
        email: user.email,
        role: 'MEMBER'
      };
      setBrokers((prev) => [...prev, newMember]);

      // Remover da lista de corretores disponíveis
      setAvailableBrokers((prev) => prev.filter((b) => b.id !== user.id));
      
      console.log('✅ EditTeam: Membro adicionado com sucesso');
    } catch (error) {
      console.error("❌ EditTeam: Erro ao adicionar membro:", error);
      alert("Erro ao adicionar membro à equipe.");
    }
  };

  const handleRemoveBroker = async (broker: TeamMember) => {
    try {
      console.log('🔍 EditTeam: Removendo membro da equipe', { userId: broker.userId, teamId: id });
      
      // Remover membro da equipe
      await supabaseTeams.removeTeamMember(Number(id), broker.userId);

      // Atualizar listas
      setBrokers((prev) => prev.filter((b) => b.userId !== broker.userId));

      const brokerAsUser: User = {
        id: broker.userId,
        name: broker.name,
        email: broker.email,
        username: '',
        password: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAvailableBrokers((prev) => [...prev, brokerAsUser]);

      if (Number(broker.userId) === user?.id && setUser && user) {
        const updatedUser = {
          ...user,
          teamId: undefined,
          team: undefined,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Erro ao remover corretor:", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "Erro ao remover corretor da equipe.";
        alert(errorMessage);
      }
    }
  };

  const handleUpdateTeam = async () => {
    if (loading) return;

    if (teamName.trim() === "") {
      alert("O nome da equipe não pode estar vazio.");
      return;
    }

    if (brokers.length === 0) {
      alert("Adicione pelo menos um corretor à equipe.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", teamName);
    formData.append("members", JSON.stringify(brokers.map((broker) => broker.userId)));

    if (teamImage && teamImage.startsWith("data:image")) {
      const imageBlob = dataURItoBlob(teamImage);
      formData.append("image", imageBlob);
    } else if (teamImage && !teamImage.startsWith("http")) {
      formData.append("imageUrl", teamImage);
    }

    try {
      console.log('🔍 EditTeam: Atualizando equipe', { teamId: id, name: teamName });
      
      // Atualizar dados básicos da equipe
      await supabaseTeams.updateTeam(Number(id), {
        name: teamName
      });
      
      // Fazer upload da imagem se houver
      if (teamImage && teamImage.startsWith("data:image")) {
        console.log('🖼️ EditTeam: Fazendo upload da nova imagem');
        const imageBlob = dataURItoBlob(teamImage);
        const imageUrl = await supabaseStorage.uploadTeamImage(Number(id), imageBlob);
        
        // Atualizar URL da imagem
        await supabaseTeams.updateTeam(Number(id), {
          image_url: imageUrl
        });
      }

      console.log('✅ EditTeam: Equipe atualizada com sucesso');
      navigate("/team");
    } catch (error) {
      console.error("❌ EditTeam: Erro ao editar equipe:", error);
      alert("Erro ao editar equipe. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("O arquivo deve ser uma imagem.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const mimeTypeMatch = dataURI.match(/^data:(image\/\w+);base64,/);
    if (!mimeTypeMatch) {
      alert("Imagem inválida!");
      return new Blob([]);
    }

    const mimeType = mimeTypeMatch[1];
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ua[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  };

  const handleIconClick = () => {
    if (imageInputRef) {
      imageInputRef.click();
    }
  };

  const handleDeleteTeam = async () => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir esta equipe?");
    if (confirmDelete) {
      try {
        console.log('🔍 EditTeam: Excluindo equipe', id);
        setIsDeleted(true);
        
        // Deletar equipe
        await supabaseTeams.deleteTeam(Number(id));

        if (setUser && user) {
          const updatedUser = {
            ...user,
            teamId: undefined,
            team: undefined,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        console.log('✅ EditTeam: Equipe excluída com sucesso');
        navigate("/team");
      } catch (error) {
        setIsDeleted(false);
        console.error("❌ EditTeam: Erro ao excluir equipe:", error);
        alert("Erro ao excluir equipe. Tente novamente.");
      }
    }
  };

  return (
    <Container>
      {loading ? (
        <LoadingMessage />
      ) : (
        <>
          {teamImage ? (
            <div style={{ position: "relative", display: "inline-block" }}>
              <TeamImage
                src={teamImage}
                alt="Imagem da equipe"
              />
              <EditButton onClick={handleIconClick}>
                <FiEdit size={16} />
              </EditButton>
              <input
                type="file"
                ref={setImageInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </div>
          ) : (
            <TeamIcon>
              <button type="button" onClick={handleIconClick}>
                <span>+</span>
              </button>
              <input
                type="file"
                ref={setImageInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </TeamIcon>
          )}

          <h2>Editar Equipe</h2>

          <Input
            type="text"
            placeholder="Nome da equipe"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />

          <ListsContainer>
            <LeftColumn>
              <h3>Adicionar Corretores</h3>
              <Input
                type="text"
                placeholder="Buscar corretor..."
                value={brokerName}
                onChange={(e) => setBrokerName(e.target.value)}
              />
              <BrokerList>
                {availableBrokers
                  .filter((broker) => broker.name.toLowerCase().includes(brokerName.toLowerCase()))
                  .map((broker) => (
                    <BrokerItem key={broker.id}>
                      {broker.name}
                      <AddBrokerButton onClick={() => handleAddBroker(broker)}>
                        <FaPlus />
                      </AddBrokerButton>
                    </BrokerItem>
                  ))}
              </BrokerList>
            </LeftColumn>

            <RightColumn>
              <h3>Corretores Adicionados</h3>
              <AddedBrokerList>
                {brokers.map((broker) => (
                  <BrokerItem key={broker.userId}>
                    {broker.name}
                    <AddBrokerButton onClick={() => handleRemoveBroker(broker)}>
                      <FaMinus />
                    </AddBrokerButton>
                  </BrokerItem>
                ))}
                {pendingInvites.map((invite) => (
                  <BrokerItem key={invite.userId}>
                    {invite.name} (Convite Pendente)
                  </BrokerItem>
                ))}
              </AddedBrokerList>
            </RightColumn>
          </ListsContainer>

          <Button onClick={handleUpdateTeam} disabled={loading}>
            {loading ? "Salvando..." : "Salvar Alterações"}
          </Button>

          <DeleteTeamButton onClick={handleDeleteTeam}>
            Excluir Equipe
          </DeleteTeamButton>
        </>
      )}
    </Container>
  );
};

export default EditTeam;