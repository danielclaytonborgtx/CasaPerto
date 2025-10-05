import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { supabaseTeams } from "../../services/supabaseTeams";
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

import { useAuth } from "../../services/authContext";

interface BrokerUser {
  id: number;
  name: string;
  username: string;
  email: string;
}
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
  const [brokers, setBrokers] = useState<BrokerUser[]>([]);
  const [brokerName, setBrokerName] = useState("");
  const [availableBrokers, setAvailableBrokers] = useState<BrokerUser[]>([]);
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

  const handleAddBroker = (broker: BrokerUser) => {

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
          const imageFile = dataURItoFile(teamImage);
          imageUrl = await supabaseStorage.uploadTeamImage(team.id, imageFile);
          
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

      // 3. Adicionar apenas o criador da equipe como membro
      const { error: creatorError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: String(user?.id),
          role: 'ADMIN'
        });

      if (creatorError) {
        console.error('❌ Erro ao adicionar criador:', creatorError);
        alert("Erro ao adicionar criador à equipe.");
        return;
      }

      console.log('✅ CreateTeam: Criador adicionado à equipe');

      // 3.1. Atualizar team_id das propriedades do criador
      console.log('🔄 CreateTeam: Atualizando team_id das propriedades do criador...');
      const { error: updatePropertiesError } = await supabase
        .from('properties')
        .update({ team_id: team.id })
        .eq('user_id', user?.id)
        .is('team_id', null);

      if (updatePropertiesError) {
        console.error('❌ Erro ao atualizar team_id das propriedades:', updatePropertiesError);
      } else {
        console.log('✅ CreateTeam: Team_id das propriedades atualizado');
      }

      // 4. Enviar convites para outros membros
      const otherBrokers = brokers.filter(broker => broker.id !== user?.id);
      if (otherBrokers.length > 0) {
        console.log('📧 CreateTeam: Enviando convites para', otherBrokers.length, 'membros');
        
        for (const broker of otherBrokers) {
          try {
            await supabaseTeams.createTeamInvitation(team.id, String(broker.id));
            console.log('✅ CreateTeam: Convite enviado para', broker.name);
          } catch (inviteError) {
            console.error('❌ CreateTeam: Erro ao enviar convite para', broker.name, inviteError);
          }
        }
      }

      // 4. Atualizar o usuário atual com dados da equipe
      if (setUser && user) {
        console.log('🔄 CreateTeam: Atualizando dados do usuário com equipe...');
        
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
          console.error('❌ CreateTeam: Erro ao buscar dados atualizados:', userError);
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
          
          console.log('✅ CreateTeam: Dados atualizados do usuário:', updatedUser);
          
          // Atualizar o usuário no contexto
          setUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          console.log('✅ CreateTeam: Usuário atualizado no contexto e localStorage');
        }
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

  const dataURItoFile = (dataURI: string, filename: string = 'team-image.jpg') => {
    const byteString = atob(dataURI.split(",")[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ua[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: "image/jpeg" });
    return new File([blob], filename, { type: "image/jpeg" });
  };

  const handleIconClick = () => {
    if (imageInputRef) {
      imageInputRef.click();
    }
  };

  // Atualiza o UI para mostrar status dos convites
  const renderBrokerStatus = (broker: BrokerUser) => {
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
