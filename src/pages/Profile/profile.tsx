import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ProfileContainer, 
  UserName, 
  UserInfo, 
  UserList, 
  Loading, 
  LogoutIcon, 
  ErrorMessage, 
  PropertyItem, 
  PropertyImage, 
  PropertyDetails, 
  TrashIcon,
  EditIcon, 
  PropertyImageContainer,
  TitlePriceContainer,
  PropertyItemLayout
} from "./styles";

import { FiLogOut } from "react-icons/fi";
import { FaTrashAlt, FaPen } from "react-icons/fa"; 

interface User {
  id: number;
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
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    fetchProperties(parsedUser.id);
    setLoading(false);
  }, [navigate]);

  const fetchProperties = async (userId: number) => {
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
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Tem certeza que deseja sair?");
    if (!confirmLogout) return;
    localStorage.removeItem("user");
    navigate("/login");
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

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <ProfileContainer>
      <LogoutIcon onClick={handleLogout}>
        <FiLogOut size={24} />
      </LogoutIcon>
      <UserName>{user.username}</UserName>
      <UserInfo>Email: {user.email}</UserInfo>

      <h2>Meus imóveis</h2>
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
