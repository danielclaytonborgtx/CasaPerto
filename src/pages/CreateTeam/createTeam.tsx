import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
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
      console.log('🔍 CreateTeam: Buscando usuários sem equipe');
      
      const { data, error } = await supabase
        .from('users')
        .select('id, name, username, email')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Erro ao buscar usuários:', error);
        alert("Erro ao carregar corretores. Tente novamente.");
        return;
      }

      console.log('✅ CreateTeam: Usuários carregados', data);
      setAvailableBrokers(data || []);
    } catch (error) {
      console.error("❌ Erro ao buscar corretores:", error);
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
      console.log("Arquivo selecionado:", file);
      // Verificar se o arquivo é uma imagem
      if (!file.type.startsWith("image/")) {
        alert("O arquivo deve ser uma imagem.");
        return;
      }

      // Verificar se o arquivo não ultrapassa o limite de 5MB
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 5MB.");
        return;
      }

      console.log("Arquivo é uma imagem válida e está dentro do limite de tamanho.");

      // Ler o arquivo como URL de imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        // Atualiza o estado com a imagem selecionada
        console.log("Imagem carregada com sucesso:", reader.result);
        setTeamImage(reader.result as string);
      };
      reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
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

    try {
      console.log('🔍 CreateTeam: Criando equipe', { teamName, brokers: brokers.length });
      
      // 1. Criar a equipe
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamName,
          created_by: String(user?.id)
        })
        .select()
        .single();

      if (teamError) {
        console.error('❌ Erro ao criar equipe:', teamError);
        alert("Erro ao criar equipe. Tente novamente.");
        return;
      }

      console.log('✅ CreateTeam: Equipe criada', team);

      // 2. Fazer upload da imagem se houver
      let imageUrl = null;
      if (teamImage) {
        try {
          console.log('🖼️ CreateTeam: Fazendo upload da imagem da equipe');
          const { supabaseStorage } = await import('../../services/supabaseStorage');
          const imageBlob = dataURItoBlob(teamImage);
          imageUrl = await supabaseStorage.uploadTeamImage(team.id, imageBlob);
          
          console.log('✅ CreateTeam: Imagem carregada com sucesso', imageUrl);
          
          // Atualizar a equipe com a URL da imagem
          await supabase
            .from('teams')
            .update({ image_url: imageUrl })
            .eq('id', team.id);
        } catch (imageError) {
          console.error('❌ Erro ao fazer upload da imagem:', imageError);
          // Continua sem a imagem
        }
      }

      // 3. Adicionar membros à equipe
      const teamMembers = brokers.map(broker => ({
        team_id: team.id,
        user_id: broker.id,
        role: 'MEMBER'
      }));

      const { error: membersError } = await supabase
        .from('team_members')
        .insert(teamMembers);

      if (membersError) {
        console.error('❌ Erro ao adicionar membros:', membersError);
        alert("Erro ao adicionar membros à equipe.");
        return;
      }

      console.log('✅ CreateTeam: Membros adicionados à equipe');

      // 4. Atualizar o usuário atual
      if (setUser && user) {
        const updatedUser = {
          ...user,
          team: team
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      // Limpeza dos dados
      setTeamName("");
      setTeamImage(null);
      setBrokers([]);
      setAvailableBrokers([]);

      alert("Equipe criada com sucesso!");
      navigate("/team");
    } catch (error) {
      console.error("❌ Erro ao criar equipe:", error);
      alert("Erro ao criar equipe. Tente novamente.");
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
