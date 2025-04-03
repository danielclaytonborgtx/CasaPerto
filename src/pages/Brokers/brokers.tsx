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
  MessageButton,
  SearchInput
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
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBrokers = useCallback(async () => {
    try {
      const response = await fetch("https://servercasaperto.onrender.com/users");
      if (response.ok) {
        const data: User[] = await response.json();
        
        const loggedInUser = data.find(broker => broker.id === user?.id);
        const otherBrokers = data.filter(broker => broker.id !== user?.id);
      
        setBrokers(loggedInUser ? [loggedInUser, ...otherBrokers] : otherBrokers);
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
      const response = await fetch(`https://servercasaperto.onrender.com/users/${brokerId}/profile-picture`);
      
      if (response.ok) {
        const data = await response.json();    
       
        const imagePath = data.picture || data.user?.picture || data.avatar || data.url;
        
        if (imagePath) {
          const fullUrl = imagePath.startsWith('http') ? imagePath : `https://servercasaperto.onrender.com${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
          
          setProfileImages((prev) => ({
            ...prev,
            [brokerId]: fullUrl
          }));
        } else {
          console.warn(`No image path found in response for broker ${brokerId}`);
          setProfileImages((prev) => ({ ...prev, [brokerId]: null }));
        }
      }
    } catch (error) {
      console.error("Error loading image:", error);
      setProfileImages((prev) => ({ ...prev, [brokerId]: null }));
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

  const filteredBrokers = brokers.filter(broker =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    broker.username.toLowerCase().includes(searchTerm.toLowerCase())
  );  

  return (
    <BrokersContainer>
      <h2>Corretores Parceiros</h2>
      <SearchInput
        type="text"
        placeholder="Buscar corretores..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <BrokerList>
        {filteredBrokers.map((broker) => (
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
            {broker.id !== user?.id && (
        <MessageButton onClick={() => navigate(`/messages/${broker.id}`)}>💬</MessageButton>
      )}
    </BrokerItem>
  ))}
</BrokerList>


    </BrokersContainer>
  );
};

export default Brokers;
