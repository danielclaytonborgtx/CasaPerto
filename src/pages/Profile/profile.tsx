import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ProfileContainer,
  UserName,
  UserList,
  Loading,
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
  ProfileImageContainer,
  ButtonContainer,
  DefaultIcon,
  StyledButton,
} from "./styles";

import {
  FaTrashAlt,
  FaPen,
  FaUsers,
  FaUserTie,
  FaEnvelope,
  FaCog,
} from "react-icons/fa";

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
  const navigate = useNavigate();

  const fetchData = useCallback(async (url: string, options?: RequestInit) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Erro: ${response.status}`);
      return await response.json();
    } catch {
      setError("Erro ao conectar com o servidor.");
      return null;
    }
  }, []);

  const fetchProfileImage = useCallback(
    async (userId: number) => {
      const data = await fetchData(`https://servercasaperto.onrender.com/users/${userId}/profile-picture`);
      if (data?.user?.picture) {
        setProfileImage(data.user.picture);
      } else {
        setProfileImage(null);
      }
    },
    [fetchData]
  );

  const fetchProperties = useCallback(
    async (userId: number) => {
      setLoading(true);
      const data = await fetchData(`https://servercasaperto.onrender.com/property/user?userId=${userId}`);
      if (data) {
        if (data.message) {
          setProperties([]);
          setError(data.message);
        } else {
          const sortedProperties = data.sort((a: Property, b: Property) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          setProperties(sortedProperties);
        }
      }
      setLoading(false);
    },
    [fetchData]
  );

  const fetchUnreadMessages = useCallback(
    async (userId: number) => {
      const sinceStored = localStorage.getItem("lastSeenMessages");
      const sinceDate = sinceStored || new Date(Date.now() - 60 * 60 * 1000).toISOString();
  
      const data = await fetchData(
        `https://servercasaperto.onrender.com/messages/unread-since?userId=${userId}&since=${sinceDate}`
      );
  
      if (data && typeof data.hasUnread === "boolean") {
        setUnreadMessages(data.hasUnread ? 1 : 0);
      }
    },
    [fetchData]
  );

  const handleDeleteProperty = async (propertyId: number) => {
    const confirmDelete = window.confirm("Deseja excluir este imóvel?");
    if (!confirmDelete) return;

    const data = await fetchData(`https://servercasaperto.onrender.com/property/${propertyId}`, {
      method: "DELETE",
    });
    if (data) {
      setProperties(properties.filter((property) => property.id !== propertyId));
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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    if (parsedUser?.id) {
      fetchProperties(parsedUser.id);
      fetchProfileImage(parsedUser.id);
      fetchUnreadMessages(parsedUser.id); // 🔔 chamadas de mensagens não lidas
    } else {
      setError("Usuário inválido");
    }
  }, [navigate, fetchProperties, fetchProfileImage, fetchUnreadMessages]);

  if (loading) return <Loading>Carregando...</Loading>;

  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <ProfileContainer>
      <ProfileImageContainer>
        {profileImage ? (
          <ProfileImage src={profileImage} alt="Foto de perfil" />
        ) : (
          <DefaultIcon>👤</DefaultIcon>
        )}
      </ProfileImageContainer>
      <UserName>{user.name}</UserName>
      <UserName>Creci-{user.username}</UserName>

      <ButtonContainer>
        <StyledButton onClick={() => navigate("/brokers")}>
          <FaUserTie size={30} />
          <span>Corretores</span>
        </StyledButton>
        <StyledButton onClick={() => navigate("/team")}>
          <FaUsers size={30} />
          <span>Equipes</span>
        </StyledButton>
        <StyledButton onClick={() => navigate("/messages")} style={{ position: 'relative' }}>
          <FaEnvelope size={30} />
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
          <FaCog size={30} />
          <span>Configurações</span>
        </StyledButton>
      </ButtonContainer>

      <SectionTitle>Meus imóveis</SectionTitle>

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
                    <p>{formatPrice(Number(property.price))}</p>
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
