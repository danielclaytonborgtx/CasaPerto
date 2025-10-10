import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import { User } from "lucide-react";
import { supabaseProfile } from "../../services/supabaseProfile";
import { supabaseProperties } from "../../services/supabaseProperties";
import { Property } from "../../types/property";
import { 
  ProfileContainer,
  ProfileSection,
  ProfileLeftSection,
  ProfileRightSection,
  ProfileImageContainer,
  ProfileInfo,
  UserName, 
  UserInfo,
  UserEmail,
  UserList, 
  ErrorMessage, 
  PropertyItem, 
  PropertyImage, 
  PropertyDetails, 
  PropertyImageContainer,
  TitlePriceContainer,
  PropertyItemLayout,
  SectionTitle,
  ProfileImage,
  DefaultIcon,
  BioViewSection,
  BioViewTitle,
  BioViewText
} from "./styles";

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  profile_picture?: string;
  bio?: string;
}

const Profiles: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError("Usuário inválido");
      setLoading(false);
      return;
    }

    const fetchUserAndProperties = async () => {
      try {
        // Buscar dados do usuário do Supabase
        const userData = await supabaseProfile.getProfile(userId);
        
        if (!userData) {
          throw new Error("Usuário não encontrado");
        }

        setUser(userData);
        
        // Carregar bio do banco de dados
        if (userData?.bio) {
          setBio(userData.bio);
        }
        
        // Buscar propriedades do usuário
        await fetchProperties(userId);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        setError("Erro ao buscar usuário.");
        setLoading(false);
      }
    };

    fetchUserAndProperties();
  }, [userId]);

  const fetchProperties = async (userId: string) => {
    try {
      // Buscar propriedades do usuário do Supabase
      const data = await supabaseProperties.getPropertiesByUser(userId);
      setProperties(data);
    } catch (err) {
      console.error("Erro ao buscar propriedades:", err);
      setError("Erro ao carregar imóveis.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingMessage />;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;
  if (!user) return <div>Usuário não encontrado</div>;

  return (
    <ProfileContainer>
      <ProfileSection style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'start' }}>
        <ProfileLeftSection>
          <ProfileImageContainer>
            {user.profile_picture ? (
              <ProfileImage 
                src={user.profile_picture} 
                alt="Foto de perfil"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                }}
              />
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
          <BioViewSection>
            <BioViewTitle>Bio</BioViewTitle>
            <BioViewText className={!bio ? 'empty' : ''}>
              {bio || "Este usuário ainda não adicionou uma bio."}
            </BioViewText>
          </BioViewSection>
        </ProfileRightSection>
      </ProfileSection>

      <SectionTitle>Imóveis em minha carteira</SectionTitle>

      {properties.length === 0 ? (
        <div>Este usuário ainda não tem imóveis postados.</div>
      ) : (
        <UserList>
          {properties.map((property) => {
            // Pegar a primeira imagem do array de imagens
            const firstImage = Array.isArray(property.images) 
              ? (typeof property.images[0] === 'string' 
                  ? property.images[0] 
                  : property.images[0]?.url)
              : '/path/to/default-image.jpg';
            
            return (
              <PropertyItem key={property.id}>
                <PropertyItemLayout>
                  <PropertyImageContainer>
                    <PropertyImage 
                      src={firstImage || '/path/to/default-image.jpg'} 
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
            );
          })}
        </UserList>
      )}
    </ProfileContainer>
  );
};

export default Profiles;
