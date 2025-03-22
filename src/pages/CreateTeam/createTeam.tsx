import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
} from "./styles";

import { useAuth, User } from "../../services/authContext";
import { FaPlus, FaMinus } from "react-icons/fa";

interface TeamInvitation {
  id: number;
  userId: number;
  teamId: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

const CreateTeam: React.FC = () => {
  const { user, setUser } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [brokers, setBrokers] = useState<User[]>([]);
  const [brokerName, setBrokerName] = useState("");
  const [availableBrokers, setAvailableBrokers] = useState<User[]>([]);
  const [teamImage, setTeamImage] = useState<string | null>(null);
  const [imageInputRef, setImageInputRef] = useState<HTMLInputElement | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [pendingInvites, setPendingInvites] = useState<TeamInvitation[]>([]);

  const fetchBrokers = useCallback(async () => {
    try {
      const response = await axios.get("https://servercasaperto.onrender.com/users/no-team");
      setAvailableBrokers(response.data);
    } catch (error) {
      console.error("Erro ao buscar corretores:", error);
      alert("Erro ao carregar corretores. Tente novamente.");
    }
  }, []);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  useEffect(() => {
    if (user && availableBrokers.length > 0) {
      const currentUser = availableBrokers.find(
        (broker) => broker.id === user.id
      );
      if (currentUser) {
        setBrokers((prevBrokers) => {
          if (!prevBrokers.some((b) => b.id === currentUser.id)) {
            return [currentUser, ...prevBrokers];
          }
          return prevBrokers;
        });
        setAvailableBrokers((prevState) =>
          prevState.filter((broker) => broker.id !== user.id)
        );
      }
    }
  }, [user, availableBrokers]);

  const handleAddBroker = (broker: User) => {
    if (broker.teamMembers) {
      broker = { ...broker, teamMembers: [] }; // Remove o teamId ao definir como undefined
    }

    if (!brokers.some((b) => b.id === broker.id)) {
      setBrokers([...brokers, broker]);
      setAvailableBrokers(availableBrokers.filter((b) => b.id !== broker.id));
    }
  };

  const handleRemoveBroker = (brokerId: number) => {
    const removedBroker = brokers.find((b) => b.id === brokerId);
    if (removedBroker) {
      setBrokers(brokers.filter((broker) => broker.id !== brokerId));
      setAvailableBrokers([...availableBrokers, removedBroker]);
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
        // 5MB
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

  const handleCreateTeam = async () => {
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
    formData.append(
      "members",
      JSON.stringify(brokers.map((broker) => broker.id))
    );

    if (teamImage) {
      const imageBlob = dataURItoBlob(teamImage);
      formData.append("image", imageBlob);
    }

    try {
      const response = await axios.post(
        "https://servercasaperto.onrender.com/team",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Atualizando o state global de usuário
      if (setUser && user) {
        const updatedUser = {
          ...user,
          team: response.data.team, // Se você tiver a equipe com mais dados, pode incluir aqui
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Atualiza no localStorage
      }

      setPendingInvites(response.data.invitations || []);

      // Limpeza dos dados
      setTeamName("");
      setTeamImage(null);
      setBrokers([]);
      setAvailableBrokers([]);

      // Redirecionando para outra página, se necessário
      navigate("/team");
    } catch (error) {
      console.error("Erro ao criar equipe:", error);
      if (error instanceof AxiosError) {
        const errorMessage =
          error.response?.data?.error ||
          "Erro ao criar equipe. Tente novamente.";
        alert(errorMessage);
      } else {
        alert("Erro ao criar equipe. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ua[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: "image/jpeg" });
  };

  const handleIconClick = () => {
    if (imageInputRef) {
      imageInputRef.click();
    }
  };

  // Atualiza o UI para mostrar status dos convites
  const renderBrokerStatus = (broker: User) => {
    const invitation = pendingInvites.find(inv => inv.userId === broker.id);
    if (invitation) {
      return (
        <span style={{ 
          fontSize: '12px', 
          color: invitation.status === 'PENDING' ? '#f0ad4e' : '#5cb85c' 
        }}>
          {invitation.status === 'PENDING' ? ' (Convite Pendente)' : ' (Convite Aceito)'}
        </span>
      );
    }
    return null;
  };

  return (
    <Container>
      {teamImage ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <TeamImage src={teamImage} alt="Imagem da equipe" />
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
      <h2>Criar Equipe</h2>

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
              .filter((broker) =>
                broker.name.toLowerCase().includes(brokerName.toLowerCase())
              )
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
              <BrokerItem key={broker.id}>
                {broker.name}
                {renderBrokerStatus(broker)}
                <AddBrokerButton onClick={() => handleRemoveBroker(broker.id)}>
                  <FaMinus />
                </AddBrokerButton>
              </BrokerItem>
            ))}
          </AddedBrokerList>
        </RightColumn>
      </ListsContainer>

      <Button onClick={handleCreateTeam} disabled={loading}>
        {loading ? "Criando..." : "Criar Equipe"}
      </Button>
    </Container>
  );
};

export default CreateTeam;
