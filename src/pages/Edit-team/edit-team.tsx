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

type Broker = User & { userId: string };

const EditTeam: React.FC = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [brokerName, setBrokerName] = useState("");
  const [availableBrokers, setAvailableBrokers] = useState<Broker[]>([]);
  const [teamImage, setTeamImage] = useState<string | null>(null);
  const [imageInputRef, setImageInputRef] = useState<HTMLInputElement | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false); // Novo estado
  const navigate = useNavigate();

  console.log("brokers:", brokers);

  const fetchTeam = useCallback(async () => {
    if (isDeleted) return;
    try {
      const response = await axios.get(`http://localhost:3333/team/${id}`);
      const teamData = response.data;
      setTeamName(teamData.name);
      setBrokers(teamData.members);
      setTeamImage(teamData.imageUrl || null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        // Se a equipe não for encontrada, redireciona para a lista de equipes
        navigate("/team");
        return;
      }
      console.error("Erro ao buscar dados da equipe:", error);
      alert("Houve um erro ao carregar a equipe. Tente novamente.");
    }
  }, [id, navigate, isDeleted]);

  const fetchBrokers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3333/users/no-team");
      const allBrokers = response.data;

      const validBrokers = allBrokers.filter((broker: User) => {
        return broker.id && broker.name;
      });

      setAvailableBrokers(validBrokers);
    } catch (error) {
      console.error("Erro ao buscar corretores:", error);
      alert("Erro ao carregar corretores. Tente novamente.");
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchTeam();
    }
    fetchBrokers();
  }, [id]);

  const handleAddBroker = async (broker: Broker) => {
    if (!brokers.some((b) => b.id === broker.id)) {
      try {
        // Chama a API para adicionar o membro à equipe
        await axios.post(`http://localhost:3333/team/${id}/member`, {
          userId: broker.id,
        });

        // Se a chamada à API for bem-sucedida, atualiza o estado local
        setBrokers([...brokers, broker]);
        setAvailableBrokers(availableBrokers.filter((b) => b.id !== broker.id));
      } catch (error) {
        console.error("Erro ao adicionar corretor:", error);
        if (error instanceof AxiosError) {
          const errorMessage =
            error.response?.data?.error ||
            "Erro ao adicionar corretor à equipe.";
          alert(errorMessage);
        } else {
          alert("Erro ao adicionar corretor à equipe. Tente novamente.");
        }
      }
    }
  };

  const handleRemoveBroker = async (broker: Broker) => {
    try {
      console.log("Tentando remover broker:", {
        teamId: id,
        userId: broker.id, // Usando userId em vez de id
      });

      // Chama a API usando a rota /teams/:teamId/leave
      const response = await axios.post(
        `http://localhost:3333/teams/${broker.userId}/leave`,
        {
          userId: broker.id, // Usando userId em vez de id
        }
      );

      console.log("Resposta da API:", response.data);

      // Atualiza o estado local usando userId para comparação
      setBrokers((prevBrokers) =>
        prevBrokers.filter((b) => b.id !== broker.id)
      );

      setAvailableBrokers((prevAvailable) => [...prevAvailable, broker]);

      // Atualiza o usuário se ele estiver removendo a si mesmo
      if (broker.id === user?.id && setUser && user) {
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
        console.error("Detalhes do erro:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        const errorMessage =
          error.response?.data?.error || "Erro ao remover corretor da equipe.";
        alert(errorMessage);
      } else {
        alert("Erro ao remover corretor da equipe. Tente novamente.");
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
    formData.append(
      "members",
      JSON.stringify(brokers.map((broker) => broker.id))
    );

    if (teamImage && teamImage.startsWith("data:image")) {
      const imageBlob = dataURItoBlob(teamImage);
      formData.append("image", imageBlob);
    } else if (teamImage && !teamImage.startsWith("http")) {
      formData.append("imageUrl", teamImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:3333/team/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

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
        const errorMessage =
          error.response?.data?.error ||
          "Erro ao editar equipe. Tente novamente.";
        alert(errorMessage);
      } else {
        alert("Erro ao editar equipe. Tente novamente.");
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
    const confirmDelete = window.confirm(
      "Você tem certeza que deseja excluir esta equipe?"
    );
    if (confirmDelete) {
      try {
        setIsDeleted(true);
        await axios.delete(`http://localhost:3333/team/${id}`);

        // Atualiza o estado do usuário para remover o teamId
        if (setUser && user) {
          const updatedUser = {
            ...user,
            teamId: undefined,
            team: undefined,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        navigate("/team"); // Redireciona para a lista de equipes após a exclusão
      } catch (error) {
        console.error("Erro ao excluir equipe:", error);
        alert("Erro ao excluir equipe. Tente novamente.");
      }
    }
  };

  useEffect(() => {
    if (id && !isDeleted) {
      // Só busca se não estiver excluída
      fetchTeam();
    }
    fetchBrokers();
  }, [id, isDeleted]);

  // Se a equipe foi excluída, não renderiza nada
  if (isDeleted) {
    return null;
  }

  return (
    <Container>
      {teamImage ? (
        <div style={{ position: "relative", display: "inline-block" }}>
          <TeamImage
            src={
              teamImage.startsWith("data:image")
                ? teamImage
                : `http://localhost:3333${teamImage}`
            }
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
              .filter((broker) =>
                broker.name.toLowerCase().includes(brokerName.toLowerCase())
              )
              .map((broker, index) => (
                <BrokerItem key={`${broker.id}-${broker.name}-${index}`}>
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
            {brokers.map((broker, index) => (
              <BrokerItem key={`${broker.id}-${broker.name}-${index}`}>
                {broker.name}
                <AddBrokerButton onClick={() => handleRemoveBroker(broker)}>
                  <FaMinus />
                </AddBrokerButton>
              </BrokerItem>
            ))}
          </AddedBrokerList>
        </RightColumn>
      </ListsContainer>

      <Button onClick={handleUpdateTeam}>Salvar Alterações</Button>

      <DeleteTeamButton onClick={handleDeleteTeam}>
        Excluir Equipe
      </DeleteTeamButton>
    </Container>
  );
};

export default EditTeam;
