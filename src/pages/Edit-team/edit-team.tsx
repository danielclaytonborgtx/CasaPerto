import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
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
      const response = await axios.get<TeamData>(`https://servercasaperto.onrender.com/team/${id}`);
      const teamData = response.data;
      setTeamName(teamData.name);
      setBrokers(teamData.members);
      setTeamImage(teamData.imageUrl);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        navigate("/team");
        return;
      }
      console.error("Erro ao buscar dados da equipe:", error);
      alert("Houve um erro ao carregar a equipe. Tente novamente.");
    }
  }, [id, navigate, isDeleted]);

  const fetchBrokers = useCallback(async () => {
    try {
      const response = await axios.get<User[]>("https://servercasaperto.onrender.com/users/no-team");
      const validBrokers = response.data.filter((broker) => broker.id && broker.name);
      setAvailableBrokers(validBrokers);
    } catch (error) {
      console.error("Erro ao buscar corretores:", error);
      alert("Erro ao carregar corretores. Tente novamente.");
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
      // Enviar convite
      await axios.post(`https://servercasaperto.onrender.com/teams/${id}/member`, {
        userId: user.id,
      });

      // Adicionar à lista de convites pendentes
      const newInvite: PendingInvite = {
        userId: user.id.toString(),
        name: user.name,
        email: user.email,
      };
      setPendingInvites((prev) => [...prev, newInvite]);

      // Remover da lista de corretores disponíveis
      setAvailableBrokers((prev) => prev.filter((b) => b.id !== user.id));
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "Erro ao enviar convite.";
        alert(errorMessage);
      }
    }
  };

  const handleRemoveBroker = async (broker: TeamMember) => {
    try {
      await axios.post(`https://servercasaperto.onrender.com/teams/${id}/leave`, {
        userId: broker.userId,
      });

      setBrokers((prev) => prev.filter((b) => b.userId !== broker.userId));

      const brokerAsUser: User = {
        id: Number(broker.userId),
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
      const response = await axios.put(`https://servercasaperto.onrender.com/team/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (setUser && user) {
        const updatedUser = {
          ...user,
          team: response.data,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      navigate("/team");
    } catch (error) {
      console.error("Erro ao editar equipe:", error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.error || "Erro ao editar equipe. Tente novamente.";
        alert(errorMessage);
      }
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
        setIsDeleted(true);
        await axios.delete(`https://servercasaperto.onrender.com/team/${id}`);

        if (setUser && user) {
          const updatedUser = {
            ...user,
            teamId: undefined,
            team: undefined,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        navigate("/team");
      } catch (error) {
        setIsDeleted(false);
        console.error("Erro ao excluir equipe:", error);
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error || "Erro ao excluir equipe. Tente novamente.";
          alert(errorMessage);
        } else {
          alert("Erro ao excluir equipe. Tente novamente.");
        }
      }
    }
  };

  return (
    <Container>
      {teamImage ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <TeamImage
            src={teamImage.startsWith("data:image") ? teamImage : `https://servercasaperto.onrender.com${teamImage}`}
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
    </Container>
  );
};

export default EditTeam;