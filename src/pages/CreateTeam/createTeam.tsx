import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TeamImage
} from './styles';

import { useAuth, User } from '../../services/authContext'; // Ajustado para pegar o contexto de autenticação
import { FaPlus, FaMinus } from 'react-icons/fa';

const CreateTeam: React.FC = () => {
  const { user, setUser } = useAuth(); // Pegando o usuário logado do contexto
  const [teamName, setTeamName] = useState('');
  const [brokers, setBrokers] = useState<User[]>([]);
  const [brokerName, setBrokerName] = useState('');
  const [availableBrokers, setAvailableBrokers] = useState<User[]>([]);
  const [teamImage, setTeamImage] = useState<string | null>(null); 
  const [imageInputRef, setImageInputRef] = useState<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const fetchBrokers = async () => {
    try {
      // Alterando a URL para a nova rota '/users/no-team'
      const response = await axios.get('https://servercasaperto.onrender.com/users/no-team');
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
    fetchBrokers(); 
  }, []);

  // Ajuste no useEffect para garantir que o usuário logado seja o primeiro na lista de brokers
  useEffect(() => {
    if (user && availableBrokers.length > 0) {
      const currentUser = availableBrokers.find(broker => broker.id === user.id);
      if (currentUser) {
        // Adiciona o usuário logado à lista de brokers, se não estiver já nela
        setBrokers((prevBrokers) => {
          if (!prevBrokers.some(b => b.id === currentUser.id)) {
            return [currentUser, ...prevBrokers]; // Adiciona o usuário logado à frente
          }
          return prevBrokers;
        });
  
        // Remove o usuário logado da lista de disponíveis
        setAvailableBrokers((prevState) => 
          prevState.filter(broker => broker.id !== user.id)
        );
      }
    }
  }, [user, availableBrokers]); // A dependência de `availableBrokers` aqui vai garantir a reatividade correta

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamImage(reader.result as string); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleCreateTeam = async () => {
    if (teamName.trim() !== '' && brokers.length > 0) {
      const formData = new FormData();
      formData.append("name", teamName);
      formData.append("members", JSON.stringify(brokers.map(broker => broker.id)));
  
      if (teamImage) {
        const imageBlob = dataURItoBlob(teamImage);
        formData.append("image", imageBlob);
      }
  
      try {
        // Cria a equipe no backend
        const response = await axios.post("https://servercasaperto.onrender.com/team", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        // Atualiza o estado do usuário logado
        if (setUser && user) {
          const updatedUser = {
            ...user,
            teamId: response.data.teamId, // Supondo que o backend retorne o ID da nova equipe
            team: response.data.team, // Supondo que o backend retorne os dados da nova equipe
          };
  
          setUser(updatedUser); // Atualiza o contexto do usuário
  
          // Persiste o estado atualizado no localStorage
          localStorage.setItem("user", JSON.stringify(updatedUser));
  
          console.log("Usuário atualizado após criar a equipe:", updatedUser); // Depuração
        }
  
        navigate("/team");
      } catch (error) {
        console.error("Erro ao criar equipe:", error);
        alert("Erro ao criar equipe. Tente novamente.");
      }
    } else {
      alert("Preencha o nome da equipe e adicione pelo menos um corretor.");
    }
  };
  
  const dataURItoBlob = (dataURI: string) => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ua = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ua[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
  };

  const handleIconClick = () => {
    if (imageInputRef) {
      imageInputRef.click(); 
    }
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

      <Button onClick={handleCreateTeam}>Criar Equipe</Button>
    </Container>
  );
};

export default CreateTeam;
