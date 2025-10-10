import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import { supabaseProperties } from "../../services/supabaseProperties";
import { supabaseMessages } from "../../services/supabaseMessages";
import { supabaseProfile } from "../../services/supabaseProfile";
import {
  ProfileContainer,
  ProfileSection,
  ProfileLeftSection,
  ProfileRightSection,
  ProfileImageContainer,
  ProfileInfo,
  BioSection,
  BioHeader,
  BioTitle,
  BioEditButton,
  BioText,
  BioInput,
  UserName,
  UserEmail,
  UserList,
  PropertyItem,
  PropertyImage,
  PropertyDetails,
  TrashIcon,
  EditIcon,
  PropertyImageContainer,
  TitlePriceContainer,
  PropertyItemLayout,
  SectionTitle,
  ProfileImage,
  ButtonContainer,
  DefaultIcon,
  StyledButton,
  PriceAndMapContainer,
  MapLink,
  UserInfo,
} from "./styles";

import {
  FaTrashAlt,
  FaPen,
} from "react-icons/fa";
import { Users, UserCheck, Mail, Settings, User, Edit } from "lucide-react";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

interface Property {
  id: number;
  title: string;
  description: string;
  description1: string;
  images: string[];
  price: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [bio, setBio] = useState<string>("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState<string>("");
  const navigate = useNavigate();


  const fetchProfileImage = useCallback(
    async (userId: number) => {
      try {
        const profile = await supabaseProfile.getProfile(String(userId));
        if (profile?.profile_picture) {
          setProfileImage(profile.profile_picture);
        } else {
          setProfileImage(null);
        }
      } catch (error) {
        console.error("Erro ao buscar imagem de perfil:", error);
        setProfileImage(null);
      }
    },
    []
  );

  const fetchProperties = useCallback(
    async (userId: number) => {
      setLoading(true);
      try {
        const data = await supabaseProperties.getPropertiesByUser(userId);
        setProperties(data as unknown as Property[]);
      } catch (error) {
        console.error("Erro ao buscar propriedades:", error);
        setProperties([]);
        setError("Erro ao carregar propriedades");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchUnreadMessages = useCallback(
    async (userId: number) => {
      try {
        const sinceStored = localStorage.getItem("lastSeenMessages");
        const sinceDate = sinceStored || new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
        const data = await supabaseMessages.getUnreadMessagesSince(String(userId), sinceDate);
        setUnreadMessages(data.hasUnread ? 1 : 0);
      } catch (error) {
        console.error("Erro ao buscar mensagens não lidas:", error);
        setUnreadMessages(0);
      }
    },
    []
  );

  const handleDeleteProperty = async (propertyId: number) => {
    const confirmDelete = window.confirm("Deseja excluir este imóvel?");
    if (!confirmDelete) return;

    try {
      await supabaseProperties.deleteProperty(propertyId);
      setProperties(properties.filter((property) => property.id !== propertyId));
    } catch (error) {
      console.error("Erro ao deletar propriedade:", error);
      alert("Erro ao deletar propriedade. Tente novamente.");
    }
  };

  const handleEditProperty = (propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId);
    if (property) {
      navigate(`/editProperty/${propertyId}`, { state: property });
    }
  };

  const handleImageClick = (propertyId: number) => {
    navigate(`/property/${propertyId}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const handleEditBio = () => {
    setTempBio(bio);
    setIsEditingBio(true);
  };

  const handleSaveBio = async () => {
    try {
      if (!user?.id) {
        console.error("Usuário não encontrado");
        return;
      }

      // Salvar bio no banco de dados
      await supabaseProfile.updateBio(String(user.id), tempBio);
      
      // Atualizar estado local
      setBio(tempBio);
      setIsEditingBio(false);
      
      console.log("✅ Bio salva com sucesso no banco de dados");
    } catch (error) {
      console.error("❌ Erro ao salvar bio:", error);
      alert("Erro ao salvar bio. Tente novamente.");
    }
  };

  const handleCancelBio = () => {
    setTempBio(bio);
    setIsEditingBio(false);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser?.id) {
      // Carregar bio do banco de dados
      const loadBio = async () => {
        try {
          const profileData = await supabaseProfile.getProfile(String(parsedUser.id));
          if (profileData?.bio) {
            setBio(profileData.bio);
          }
        } catch (error) {
          console.error("Erro ao carregar bio:", error);
        }
      };
      
      loadBio();
      fetchProperties(parsedUser.id);
      fetchProfileImage(parsedUser.id);
      fetchUnreadMessages(parsedUser.id); 
    } else {
      setError("Usuário inválido");
    }
  }, [navigate, fetchProperties, fetchProfileImage, fetchUnreadMessages]);

  // Polling para mensagens não lidas em tempo real
  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const checkUnreadMessages = async () => {
      if (!isMounted) return;
      
      try {
        const sinceStored = localStorage.getItem("lastSeenMessages");
        const sinceDate = sinceStored || new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
        const data = await supabaseMessages.getUnreadMessagesSince(String(user.id), sinceDate);
        const hasUnread = data.hasUnread;
        
        // Só atualizar se houve mudança
        if (hasUnread !== (unreadMessages > 0)) {
          setUnreadMessages(hasUnread ? 1 : 0);
        }
      } catch (error) {
        console.error("Erro ao verificar mensagens não lidas:", error);
      }
    };

    // Verificar mensagens a cada 3 segundos
    intervalId = setInterval(checkUnreadMessages, 3000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [user?.id, unreadMessages]);

  if (loading) return <LoadingMessage />;

  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <ProfileContainer>
      <ProfileSection style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'start' }}>
        <ProfileLeftSection>
          <ProfileImageContainer>
            {profileImage ? (
              <ProfileImage src={profileImage} alt="Foto de perfil" />
            ) : (
              <DefaultIcon>
                <User size={32} />
              </DefaultIcon>
            )}
          </ProfileImageContainer>
          
          <ProfileInfo>
            <UserName>{user.name}</UserName>
            <UserInfo>Creci-{user.username}</UserInfo>
            <UserEmail>{user.email}</UserEmail>
          </ProfileInfo>
        </ProfileLeftSection>

        <ProfileRightSection>
          <BioSection>
            <BioHeader>
              <BioTitle>Bio</BioTitle>
              <BioEditButton onClick={handleEditBio}>
                <Edit size={16} />
              </BioEditButton>
            </BioHeader>
            
            {isEditingBio ? (
              <div>
                <BioInput
                  value={tempBio}
                  onChange={(e) => setTempBio(e.target.value)}
                  placeholder="Escreva sua bio aqui..."
                  maxLength={200}
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button 
                    onClick={handleSaveBio}
                    style={{
                      background: '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Salvar
                  </button>
                  <button 
                    onClick={handleCancelBio}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <BioText className={!bio ? 'empty' : ''}>
                {bio || "Clique no ícone de edição para adicionar sua bio..."}
              </BioText>
            )}
          </BioSection>
        </ProfileRightSection>
      </ProfileSection>

      <ButtonContainer>
        <StyledButton onClick={() => navigate("/brokers")}>
          <UserCheck size={30} />
          <span>Corretores</span>
        </StyledButton>
        <StyledButton onClick={() => navigate("/team")}>
          <Users size={30} />
          <span>Equipes</span>
        </StyledButton>
        <StyledButton 
          onClick={() => {
            // Atualizar lastSeenMessages quando navegar para mensagens
            const now = new Date().toISOString();
            localStorage.setItem("lastSeenMessages", now);
            setUnreadMessages(0);
            navigate("/messages");
          }} 
          style={{ position: 'relative' }}
        >
          <Mail size={30} />
          {unreadMessages > 0 && (
            <span
              style={{
                position: "absolute",
                top: -8,
                right: -4,
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              !
            </span>
          )}
          <span>Mensagens</span>
        </StyledButton>
        <StyledButton onClick={() => navigate("/settings")}>
          <Settings size={30} />
          <span>Configurações</span>
        </StyledButton>
      </ButtonContainer>

      <SectionTitle>Minha carteira imóveis</SectionTitle>

      {properties.length === 0 ? (
        <div>{error || "Você ainda não tem imóveis postados."}</div>
      ) : (
        <UserList>
          {properties.map((property) => {
            const imageUrl = property.images && property.images[0]
              ? property.images[0]
              : 'https://via.placeholder.com/150';

            return (
              <PropertyItem key={property.id}>
                <PropertyItemLayout>
                  <PropertyImageContainer>
                    <PropertyImage
                      src={imageUrl}
                      alt={property.title}
                      onClick={() => handleImageClick(property.id)}
                    />
                  </PropertyImageContainer>

                  <TitlePriceContainer>
                    <strong>{property.title}</strong>
                    <PriceAndMapContainer>
                      <p>{formatPrice(Number(property.price))}</p>

                      <MapLink onClick={() => navigate("/map", { state: { id: property.id } })}>
                        Ver no mapa
                      </MapLink>

                    </PriceAndMapContainer>
                  </TitlePriceContainer>

                </PropertyItemLayout>
                <PropertyDetails>
                  <p>{property.description}</p>
                  {property.description1 && <strong>{property.description1}</strong>}
                </PropertyDetails>
                <div>
                  <TrashIcon onClick={() => handleDeleteProperty(property.id)}>
                    <FaTrashAlt size={18} color="red" />
                  </TrashIcon>
                  <EditIcon onClick={() => handleEditProperty(property.id)}>
                    <FaPen size={18} />
                  </EditIcon>
                </div>
              </PropertyItem>
            );
          })}
        </UserList>
      )}
    </ProfileContainer>
  );
};

export default Profile;
