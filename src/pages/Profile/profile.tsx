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
  images: string [];
  price: string;
  createdAt: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
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
      
        const imageUrl = data.user.picture;  
        setProfileImage(imageUrl);
         
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
    } else {
      setError("Usuário inválido");
    }
  }, [navigate, fetchProperties, fetchProfileImage]);

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
          <FaUserTie size={20} />
          <span>Corretores</span>
        </StyledButton>
        <StyledButton onClick={() => navigate("/team")}>
          <FaUsers size={20} />
          <span>Equipes</span>
        </StyledButton>
        <StyledButton onClick={() => navigate("/messages")}>
          <FaEnvelope size={20} />
          <span>Mensagens</span>
        </StyledButton>
        <StyledButton onClick={() => navigate("/settings")}>
          <FaCog size={20} />
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
                    <FaTrashAlt size={18} color="black" />
                  </TrashIcon>
                  <EditIcon onClick={() => handleEditProperty(property.id)}>
                    <FaPen size={18} color="black" />
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