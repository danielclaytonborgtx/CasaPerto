import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProfileContainer, UserName, UserInfo, UserList, Loading, LogoutIcon } from "./styles";
import { FiLogOut } from "react-icons/fi";

// Definindo o tipo User
interface User {
  id: number;
  username: string;
  email: string;
}

// Definindo o tipo Property (Imóvel)
interface Property {
  id: number;
  title: string;
  description: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]); // Lista de imóveis
  const [error, setError] = useState<string | null>(null); // Estado para erros
  const navigate = useNavigate();

  // Efeito para ler o usuário do localStorage ao carregar o componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Define o usuário no estado
      fetchProperties(JSON.parse(storedUser).id); // Carrega os imóveis do usuário
      setLoading(false);
    } else {
      navigate("/login"); // Se não encontrar o usuário, redireciona para a página de login
    }
  }, [navigate]);

  // Função para buscar os imóveis do usuário
  const fetchProperties = async (userId: number) => {
    try {
      const response = await fetch(`https://casa-mais-perto-server-clone-production.up.railway.app/imoveis?userId=${userId}`); // Substitua pela URL da sua API
      const data = await response.json();
      if (response.ok) {
        setProperties(data); // Atualiza a lista de imóveis
      } else {
        setError("Erro ao carregar imóveis.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    }
  };

   // Função de logout
   const handleLogout = () => {
    localStorage.removeItem("user"); // Remove o usuário do localStorage
    navigate("/login"); // Redireciona para a página de login
  };

  // Exibição enquanto o conteúdo está carregando
  if (loading) {
    return <Loading>Carregando...</Loading>;
  }

  // Exibição caso ocorra algum erro
  if (error) {
    return <div>{error}</div>;
  }

  // Verificando se 'user' está definido antes de renderizar as propriedades
  if (!user) {
    return <div>Usuário não encontrado</div>;
  }

  return (
    <ProfileContainer>
      <LogoutIcon onClick={handleLogout}>
        <FiLogOut size={24} />
      </LogoutIcon>
      <UserName>Bem-vindo, {user.username}</UserName>
      <UserInfo>Email: {user.email}</UserInfo>
      <UserInfo>ID do usuário: {user.id}</UserInfo>

      <h2>Imóveis Postados</h2>
      {properties.length === 0 ? (
        <div>Você ainda não tem imóveis postados.</div> // Exibe mensagem caso não haja imóveis
      ) : (
        <UserList>
          {properties.map((property) => (
            <li key={property.id}>
              <strong>{property.title}</strong>: {property.description}
            </li>
          ))}
        </UserList>
      )}
    </ProfileContainer>
  );
};

export default Profile;
