import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { User, MessageSquare } from "lucide-react"; 
import { 
  BrokersContainer, 
  BrokerList,
  BrokerItem, 
  BrokerDetails, 
  BrokerIcon, 
  ErrorMessage, 
  ProfileImage,
  ProfileLink,
  MessageButton,
  SearchInput,
  BrokerName,
  BrokerId,
  BrokerEmail
} from "./styles";
import { useAuth } from "../../services/authContext"; 
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import { supabase } from "../../lib/supabase";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profile_picture?: string;
}

const Brokers: React.FC = () => {
  const navigate = useNavigate(); 
  const { user } = useAuth(); 
  const [brokers, setBrokers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImages, setProfileImages] = useState<Record<string, string | null>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBrokers = useCallback(async () => {
    try {
      console.log('🔍 Brokers: Carregando usuários do Supabase');
      
      const { data, error } = await supabase
        .from('users')
        .select('id, name, username, email, profile_picture')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Erro ao carregar usuários:', error);
        setError("Erro ao carregar corretores.");
        return;
      }

      console.log('✅ Brokers: Usuários carregados', data);
      
      if (data) {
        const loggedInUser = data.find(broker => broker.id === String(user?.id));
        const otherBrokers = data.filter(broker => broker.id !== String(user?.id));
      
        setBrokers(loggedInUser ? [loggedInUser, ...otherBrokers] : otherBrokers);
      }
    } catch (err) {
      console.error('❌ Erro ao conectar com Supabase:', err);
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]); 

  const fetchProfileImage = async (brokerId: string, profilePicture?: string) => {
    try {
      if (profilePicture) {
        console.log('🖼️ Brokers: Usando imagem do perfil do Supabase', profilePicture);
        setProfileImages((prev) => ({
          ...prev,
          [brokerId]: profilePicture
        }));
      } else {
        console.log('🖼️ Brokers: Nenhuma imagem de perfil encontrada para', brokerId);
        setProfileImages((prev) => ({ ...prev, [brokerId]: null }));
      }
    } catch (error) {
      console.error("❌ Erro ao carregar imagem:", error);
      setProfileImages((prev) => ({ ...prev, [brokerId]: null }));
    }
  };

  useEffect(() => {
    const fetchBrokersAndImages = async () => {
      await fetchBrokers();
    };
  
    fetchBrokersAndImages();
  }, [fetchBrokers]);

  // Carregar imagens quando os brokers mudarem
  useEffect(() => {
    if (brokers.length > 0) {
      const profilePromises = brokers.map((broker) => 
        fetchProfileImage(broker.id, broker.profile_picture)
      );

      Promise.all(profilePromises);
    }
  }, [brokers]); 

  if (loading) return <LoadingMessage />;
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
              <BrokerIcon>
                <User size={20} />
              </BrokerIcon>
            )}
            <BrokerDetails>
              <BrokerName>{broker.name}</BrokerName>
              <BrokerId>{broker.username}</BrokerId>
              <BrokerEmail>{broker.email}</BrokerEmail>
              <ProfileLink onClick={() => navigate(`/profiles/${broker.id}`)}>
                Ver perfil
              </ProfileLink>
            </BrokerDetails>
            {broker.id !== String(user?.id) && (
        <MessageButton onClick={() => {
          // Se usuário está logado → mensagens internas
          // Se não está logado (visitante) → formulário de contato
          if (user) {
            navigate(`/messages/${broker.id}`);
          } else {
            navigate(`/contact/${broker.id}`);
          }
        }}>
          <MessageSquare size={18} />
        </MessageButton>
      )}
    </BrokerItem>
  ))}
</BrokerList>


    </BrokersContainer>
  );
};

export default Brokers;
