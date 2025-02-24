import React, { useEffect, useState } from "react";
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
  StyledButton
} from "./styles";

import { FaTrashAlt, FaPen, FaUsers, FaUserTie, FaEnvelope, FaCog } from "react-icons/fa"; 

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
  const navigate = useNavigate();

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
  }, [navigate]);

  const fetchProfileImage = async (userId: number) => {
    try {
      const response = await fetch(`https://server-2-production.up.railway.app/users/${userId}/profile-picture`);
      if (response.ok) {
        const data = await response.json();

        if (data.user?.picture) {
          setProfileImage(`https://server-2-production.up.railway.app${data.user.picture}`);
        } else {
          setProfileImage(null); 
        }
      } 
    } catch {
      setError("Erro ao conectar com o servidor para carregar a imagem.");
    }
  };

  const fetchProperties = async (userId: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://server-2-production.up.railway.app/property/user?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
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
      } else if (response.status === 404) {
        setProperties([]);
        setError(null);
      } else {
        setError("Erro ao carregar imóveis.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    }
    finally {
      setLoading(false); 
    }
  };

  const handleDeleteProperty = async (propertyId: number) => {
    const confirmDelete = window.confirm("Deseja excluir este imóvel?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://server-2-production.up.railway.app/property/${propertyId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProperties(properties.filter(property => property.id !== propertyId));
      } else {
        setError("Erro ao deletar o imóvel.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
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
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  if (loading) return <Loading>Carregando...</Loading>;
  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <ProfileContainer>

      <ProfileImageContainer>
        {profileImage ? (
          <ProfileImage 
          src={profileImage} 
          alt="Foto de perfil" 
        />
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
              : '/path/to/default-image.jpg';

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
