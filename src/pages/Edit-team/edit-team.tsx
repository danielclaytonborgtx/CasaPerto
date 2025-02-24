import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
  DeleteTeamButton
} from './styles';

import { User } from '../../services/authContext'; 
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';

const EditTeam: React.FC = () => {
  const { id } = useParams(); // Pega o ID da equipe da URL
  const [teamName, setTeamName] = useState('');
  const [brokers, setBrokers] = useState<User[]>([]);
  const [brokerName, setBrokerName] = useState('');
  const [availableBrokers, setAvailableBrokers] = useState<User[]>([]);
  const [teamImage, setTeamImage] = useState<string | null>(null); 
  const [imageInputRef, setImageInputRef] = useState<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  // Função de buscar os dados da equipe
  const fetchTeam = useCallback(async () => {
    try {
      // console.log("Fetching team data...");
      const response = await axios.get(`http://localhost:3333/team/${id}`);
      const teamData = response.data;
      // console.log("Team data received:", teamData); // Log da resposta
      setTeamName(teamData.name);
      setBrokers(teamData.members); // Supondo que os membros sejam um array de objetos corretor
      setTeamImage(teamData.imageUrl || null);
    } catch (error) {
      console.error('Erro ao buscar dados da equipe:', error);
      alert('Houve um erro ao carregar a equipe. Tente novamente.');
    }
  }, [id]); // Adicionando 'id' como dependência

  // Carregar a lista de corretores
  const fetchBrokers = async () => {
    try {
      // Alterando a URL para a nova rota '/users/no-team'
      const response = await axios.get('http://localhost:3333/users/no-team');
      const allBrokers = response.data;
  
      console.log("Corretores sem time recebidos da API:", allBrokers);
  
      // Atualiza a lista de corretores disponíveis
      setAvailableBrokers(allBrokers);
    } catch (error) {
      console.error('Erro ao buscar os corretores:', error);
      alert('Houve um erro ao carregar os corretores. Tente novamente.');
    }
  };

  useEffect(() => {
    if (id) {
      fetchTeam();
    }
    fetchBrokers(); // Carregar corretores disponíveis
  }, [id, fetchTeam]); // Incluindo 'fetchTeam' nas dependências

  const handleAddBroker = (broker: User) => {
      // Verifica se o corretor já tem um teamId
      if (broker.teamId) {
        alert('Este corretor já está em um time.');
        return; // Impede a adição do corretor se já tiver um teamId
      }
    
      // Se o corretor não tem um teamId, é seguro adicioná-lo
      if (!brokers.some(b => b.id === broker.id)) {
        setBrokers([...brokers, broker]);
        setAvailableBrokers(availableBrokers.filter(b => b.id !== broker.id)); // Remove da lista de disponíveis
      }
    };
  
    const handleRemoveBroker = (brokerId: number) => {
      const removedBroker = brokers.find(b => b.id === brokerId);
      if (removedBroker) {
        setBrokers(brokers.filter(broker => broker.id !== brokerId));
        setAvailableBrokers([...availableBrokers, removedBroker]); // Reinsere na lista de disponíveis
      }
    };

  const handleUpdateTeam = async () => {
    // console.log("Team Name:", teamName);
    // console.log("Brokers:", brokers);
    // console.log("Imagem da equipe:", teamImage);
  
    if (teamName.trim() !== '' && brokers.length > 0) {
      const formData = new FormData();
      formData.append("name", teamName);
      formData.append("members", JSON.stringify(brokers.map(broker => broker.id)));
  
      // Verifica se há uma imagem nova
      if (teamImage && teamImage.startsWith("data:image")) {  
        const imageBlob = dataURItoBlob(teamImage);
        formData.append("image", imageBlob);
      } else if (teamImage) {
        // Se não houver imagem nova, apenas a URL existente
        formData.append("imageUrl", teamImage); // Certifique-se de que o servidor está esperando por essa chave
      }
  
      try {
        await axios.put(`http://localhost:3333/team/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate("/team"); // Redireciona para a lista de equipes após a edição
      } catch (error) {
        console.error("Erro ao editar equipe:", error);
        alert("Erro ao editar equipe. Tente novamente.");
      }
    } else {
      alert("Preencha o nome da equipe e adicione pelo menos um corretor.");
    }
  };
  
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // console.log("Image uploaded:", reader.result); // Log da imagem carregada
        setTeamImage(reader.result as string); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const dataURItoBlob = (dataURI: string) => {
    // Verifica o tipo de imagem presente no dataURI (suporta JPEG, PNG, GIF)
    const mimeTypeMatch = dataURI.match(/^data:(image\/\w+);base64,/);
    if (!mimeTypeMatch) {
      alert('Imagem inválida!');
      return new Blob([]);
    }
    
    const mimeType = mimeTypeMatch[1];  // 'jpeg', 'png', 'gif', etc.
    const byteString = atob(dataURI.split(',')[1]);
  
    // Verifica se o byteString tem um tamanho válido
    if (byteString.length % 4 === 0) {
      const ab = new ArrayBuffer(byteString.length);
      const ua = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ua[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: mimeType });
    } else {
      alert('Erro ao processar a imagem.');
      return new Blob([]);
    }
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
        await axios.delete(`http://localhost:3333/team/${id}`);
        navigate("/team"); // Redireciona para a lista de equipes após a exclusão
      } catch (error) {
        console.error("Erro ao excluir equipe:", error);
        alert("Erro ao excluir equipe. Tente novamente.");
      }
    }
  };  

  return (
    <Container>
      {teamImage ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <TeamImage 
              src={teamImage.startsWith("data:image") ? teamImage : `http://localhost:3333${teamImage}`} 
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
              <BrokerItem key={broker.id}>
                {broker.name}
                <AddBrokerButton onClick={() => handleRemoveBroker(broker.id)}>
                  <FaMinus /> 
                </AddBrokerButton>
              </BrokerItem>
            ))}
          </AddedBrokerList>
        </RightColumn>
      </ListsContainer>

      <Button onClick={handleUpdateTeam}>Salvar Alterações</Button>

      <DeleteTeamButton onClick={handleDeleteTeam} style={{ backgroundColor: "red" }}>
        Excluir Equipe
      </DeleteTeamButton>

    </Container>
  );
};

export default EditTeam;
