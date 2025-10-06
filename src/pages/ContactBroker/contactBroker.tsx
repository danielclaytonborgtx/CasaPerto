import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Phone } from 'lucide-react';
import VisitorMessageForm from '../../components/VisitorMessageForm/VisitorMessageForm';
import { supabaseProfile } from '../../services/supabaseProfile';
import {
  Container,
  Header,
  BrokerInfo,
  BrokerAvatar,
  BrokerDetails,
  BrokerName,
  BrokerEmail,
  BrokerPhone,
  ContentWrapper
} from './styles';

interface Broker {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
}

const ContactBroker: React.FC = () => {
  const { brokerId } = useParams<{ brokerId: string }>();
  const navigate = useNavigate();
  const [broker, setBroker] = useState<Broker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrokerInfo = async () => {
      if (!brokerId) {
        setError('ID do corretor não fornecido');
        setLoading(false);
        return;
      }

      try {
        const profile = await supabaseProfile.getProfile(brokerId);
        if (profile) {
          setBroker({
            id: brokerId,
            name: profile.name,
            email: profile.email,
            phone: (profile as any).phone,
            profile_picture: profile.profile_picture
          });
        } else {
          setError('Corretor não encontrado');
        }
      } catch (err) {
        console.error('Erro ao buscar informações do corretor:', err);
        setError('Erro ao carregar informações do corretor');
      } finally {
        setLoading(false);
      }
    };

    fetchBrokerInfo();
  }, [brokerId]);

  const handleMessageSuccess = () => {
    // Opcional: mostrar confirmação ou redirecionar
    console.log('Mensagem enviada com sucesso!');
  };

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: '#64748b' }}>Carregando...</div>
        </div>
      </Container>
    );
  }

  if (error || !broker) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', color: '#dc2626', marginBottom: '20px' }}>
            {error || 'Corretor não encontrado'}
          </div>
          <button
            onClick={() => navigate('/brokers')}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Voltar para corretores
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>Entrar em Contato</h1>
      </Header>

      <ContentWrapper>
        <BrokerInfo>
          <BrokerAvatar>
            {broker.profile_picture ? (
              <img 
                src={broker.profile_picture} 
                alt={broker.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <User size={40} />
            )}
          </BrokerAvatar>
          
          <BrokerDetails>
            <BrokerName>{broker.name}</BrokerName>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Mail size={16} />
              <BrokerEmail>{broker.email}</BrokerEmail>
            </div>
            
            {broker.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} />
                <BrokerPhone>{broker.phone}</BrokerPhone>
              </div>
            )}
          </BrokerDetails>
        </BrokerInfo>

        <VisitorMessageForm
          brokerId={broker.id}
          brokerName={broker.name}
          onSuccess={handleMessageSuccess}
        />
      </ContentWrapper>
    </Container>
  );
};

export default ContactBroker;
