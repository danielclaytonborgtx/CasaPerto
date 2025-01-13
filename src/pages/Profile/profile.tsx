import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContainer, UserName, UserInfo, UserList, Loading, LogoutIcon, ErrorMessage, PropertyItem, PropertyImage, PropertyDetails, TrashIcon } from "./styles";
import { FiLogOut } from "react-icons/fi";
import { FaTrashAlt } from "react-icons/fa"; 

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
  images: string;  
  price: string;  
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser); 
      fetchProperties(parsedUser.id); 
      setLoading(false);
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

  const fetchProperties = async (userId: number) => {
    try {
      const response = await fetch(
        `https://server-2-production.up.railway.app/user?userId=${userId}`
      );
      if (response.ok) {
        const data = await response.json();
   
        if (data.message) {
          setProperties([]); // Não há propriedades para o usuário
          setError(data.message); 
        } else {
          setProperties(data); // Propriedades carregadas
        }
      } else if (response.status === 404) {
        setProperties([]); 
        setError(null); // Não encontrou propriedades
      } else {
        setError("Erro ao carregar imóveis.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Tem certeza que deseja sair?");

    if (!confirmLogout) {
      return; 
    }

    localStorage.removeItem("user"); 
    navigate("/login"); 
  };

  const handleDeleteProperty = async (propertyId: number) => {
    const confirmDelete = window.confirm("Deseja excluir este imóvel?");

    if (!confirmDelete) {
      return; 
    }

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

  if (loading) {
    return <Loading>Carregando...</Loading>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!user) {
    return <div>Usuário não encontrado</div>;
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <ProfileContainer>
      <LogoutIcon onClick={handleLogout}>
        <FiLogOut size={24} />
      </LogoutIcon>
      <UserName>Bem-vindo, {user.username}</UserName>
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
                <PropertyImage 
                  src={imageUrl} 
                  alt={property.title} 
                />
                <PropertyDetails>
                  <strong>{property.title}</strong>
                  <p>{property.description}</p>
                  <p>Preço: {formatPrice(Number(property.price))}</p>
                  {property.description1 && <p>{property.description1}</p>} 
                </PropertyDetails>
                <TrashIcon onClick={() => handleDeleteProperty(property.id)}>
                  <FaTrashAlt size={18} color="black" />
                </TrashIcon>
              </PropertyItem>
            );
          })}
        </UserList>
      )}
    </ProfileContainer>
  );
};

export default Profile;
