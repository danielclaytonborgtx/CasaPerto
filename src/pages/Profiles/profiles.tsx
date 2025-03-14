import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ProfileContainer, 
  UserName, 
  UserInfo, 
  UserList, 
  Loading, 
  ErrorMessage, 
  PropertyItem, 
  PropertyImage, 
  PropertyDetails, 
  PropertyImageContainer,
  TitlePriceContainer,
  PropertyItemLayout,
  SectionTitle,
  ProfileImage,
  ProfileImageContainer,
  DefaultIcon
} from "./styles";

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

const Profiles: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]); 
  const [error, setError] = useState<string | null>(null); 
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError("Usuário inválido");
      setLoading(false);
      return;
    }

    const fetchUserAndProperties = async () => {
      try {
        let userData: User;

        if (isNaN(Number(userId))) {
          const response = await fetch(`http://localhost:3333/users/${userId}`);
          if (!response.ok) {
            throw new Error("Usuário não encontrado");
          }
          userData = await response.json();
        } else {
          
          const response = await fetch(`http://localhost:3333/users/${userId}`);
          if (!response.ok) {
            throw new Error("Usuário não encontrado");
          }
          userData = await response.json();
        }

        setUser(userData);
        fetchProperties(userData.id); 
        fetchProfileImage(userData.id); 
      } catch {
        setError("Erro ao buscar usuário.");
      }
    };

    fetchUserAndProperties();
  }, [userId]);

  const fetchProperties = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3333/property/user?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data.sort((a: Property, b: Property) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      } else {
        setError("Erro ao carregar imóveis.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfileImage = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3333/users/${userId}/profile-picture`);
      if (response.ok) {
        const data = await response.json();
        setProfileImage(data.user?.picture ? `http://localhost:3333${data.user.picture}` : null);
      }
    } catch {
      setError("Erro ao carregar a imagem do perfil.");
    }
  };

  if (loading) return <Loading>Carregando...</Loading>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
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
            <UserInfo>Creci-{user.username}</UserInfo>
            <UserInfo>{user.email}</UserInfo>

      <SectionTitle>Imóveis de {user.name}</SectionTitle>

      {properties.length === 0 ? (
        <div>Este usuário ainda não tem imóveis postados.</div>
      ) : (
        <UserList>
          {properties.map((property) => (
            <PropertyItem key={property.id}>
              <PropertyItemLayout>
                <PropertyImageContainer>
                  <PropertyImage 
                    src={property.images[0] || '/path/to/default-image.jpg'} 
                    alt={property.title} 
                    onClick={() => navigate(`/property/${property.id}`)}
                  />
                </PropertyImageContainer>
                <TitlePriceContainer>
                  <strong>{property.title}</strong>
                  <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(property.price))}</p>
                </TitlePriceContainer>
              </PropertyItemLayout>
              <PropertyDetails>
                <p>{property.description}</p>
              </PropertyDetails>
            </PropertyItem>
          ))}
        </UserList>
      )}
    </ProfileContainer>
  );
};

export default Profiles;
