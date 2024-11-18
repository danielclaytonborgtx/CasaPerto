import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/auth";
import { Container, Title, UserInfo, ErrorMessage, ImoveisList } from "./styles";

interface Imovel {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      console.log("Carregando imóveis para o usuário com ID:", user.id); // Log do user.id
      setLoading(true);
      fetch(`https://casa-mais-perto-server-clone-production.up.railway.app/imoveis?userId=${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("Dados dos imóveis carregados:", data); // Log dos dados da API
          setImoveis(data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Erro ao carregar imóveis.");
          setLoading(false);
          console.error("Erro ao carregar imóveis:", error);
        });
    }
  }, [user]);  

  if (!user) {
    return <ErrorMessage>Usuário não encontrado. Faça o login.</ErrorMessage>;
  }

  if (loading) {
    return <p>Carregando seus imóveis...</p>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>Perfil de {user.username}</Title>
      <UserInfo>
        <img src="caminho-para-imagem.jpg" alt="Imagem de Perfil" />
        <p>Email: {user.email}</p>
      </UserInfo>
      <ImoveisList>
        <h2>Meus Imóveis</h2>
        {imoveis.length === 0 ? (
          <p>Você ainda não tem imóveis postados.</p>
        ) : (
          imoveis.map((imovel) => (
            <div key={imovel.id}>
              <h3>{imovel.title}</h3>
              <p>{imovel.description}</p>
              <img src={imovel.imageUrl} alt={imovel.title} />
            </div>
          ))
        )}
      </ImoveisList>
    </Container>
  );
};

export default Profile;
