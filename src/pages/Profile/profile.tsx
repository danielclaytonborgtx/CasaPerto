import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/auth"; // Importando o hook de autenticação
import { Container, Title, UserInfo, ErrorMessage, ImoveisList } from "./styles"; // Ajuste de estilos conforme necessário

interface Imovel {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

const Profile: React.FC = () => {
  const { user } = useAuth(); // Acessando o usuário autenticado
  const [imoveis, setImoveis] = useState<Imovel[]>([]); // Estado para os imóveis

  useEffect(() => {
    if (user) {
      // Aqui você pode fazer a chamada à API para obter os imóveis do usuário
      fetch(`https://casa-mais-perto-server-clone-production.up.railway.app/imoveis?userId=${user.id}`)
        .then((response) => response.json())
        .then((data) => setImoveis(data))
        .catch((error) => console.error("Erro ao carregar imóveis:", error));
    }
  }, [user]); // Vai ser executado quando o usuário mudar

  if (!user) {
    return <ErrorMessage>Usuário não encontrado. Faça o login.</ErrorMessage>;
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
