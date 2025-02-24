import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; 
import { 
  BrokersContainer, 
  BrokerList,
  BrokerItem, 
  BrokerDetails, 
  BrokerIcon, 
  Loading, 
  ErrorMessage, 
  ProfileImage,
  ProfileLink,
  MessageButton // Novo estilo para o botão de mensagem
} from "./styles";
import { useAuth } from "../../services/authContext"; 

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

const Brokers: React.FC = () => {
  const navigate = useNavigate(); 
  const { user } = useAuth(); 
  const [brokers, setBrokers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImages, setProfileImages] = useState<Record<number, string | null>>({});

  const fetchBrokers = useCallback(async () => {
    try {
      const response = await fetch("https://server-2-production.up.railway.app/users");
      if (response.ok) {
        const data: User[] = await response.json();
        const filteredBrokers = data.filter(broker => broker.id !== user?.id);
        setBrokers(filteredBrokers);
      } else {
        setError("Erro ao carregar corretores.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]); 

  const fetchProfileImage = async (brokerId: number) => {
    try {
      const response = await fetch(`https://server-2-production.up.railway.app/users/${brokerId}/profile-picture`);
      if (response.ok) {
        const data = await response.json();
        setProfileImages((prev) => ({
          ...prev,
          [brokerId]: data.user?.picture ? `https://server-2-production.up.railway.app${data.user.picture}` : null
        }));
      } else {
        setProfileImages((prev) => ({
          ...prev,
          [brokerId]: null 
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar a imagem:", error);
      setProfileImages((prev) => ({
        ...prev,
        [brokerId]: null 
      }));
    }
  };

  useEffect(() => {
    const fetchBrokersAndImages = async () => {
      await fetchBrokers();
  
      const profilePromises = brokers.map((broker) => 
        fetchProfileImage(broker.id)
      );

      await Promise.all(profilePromises);
    };
  
    fetchBrokersAndImages();
  }, [fetchBrokers, brokers]); 

  if (loading) return <Loading>Carregando...</Loading>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <BrokersContainer>
      <h2>Corretores Parceiros</h2>

      <BrokerList>
        {brokers.map((broker) => (
          <BrokerItem key={broker.id}>
            {profileImages[broker.id] ? (
              <ProfileImage src={profileImages[broker.id]!} />
            ) : (
              <BrokerIcon>👤</BrokerIcon>
            )}
            <BrokerDetails>
              <p>{broker.name}</p>
              <strong>{broker.username}</strong>
              <p>{broker.email}</p>
              <ProfileLink onClick={() => navigate(`/profiles/${broker.id}`)}>
                Ver perfil
              </ProfileLink>
            </BrokerDetails>
            {/* Botão de Mensagem */}
            <MessageButton onClick={() => navigate(`/messages/${broker.id}`)}>💬</MessageButton>
          </BrokerItem>
        ))}
      </BrokerList>

    </BrokersContainer>
  );
};

export default Brokers;
