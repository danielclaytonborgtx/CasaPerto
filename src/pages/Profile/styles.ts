import styled from "styled-components";

// Contêiner principal do perfil
export const ProfileContainer = styled.div`
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

// Nome do usuário (Título)
export const UserName = styled.h1`
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
`;

// Informações do usuário (email, ID, etc.)
export const UserInfo = styled.p`
  font-size: 1.2em;
  color: #555;
  margin-bottom: 10px;
`;

// Lista de imóveis postados
export const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
  font-size: 1em;
  color: #333;

  li {
    padding: 10px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
`;

// Estilo para o carregamento (em caso de loading)
export const Loading = styled.div`
  font-size: 1.5em;
  color: #888;
  padding: 20px;
`;

export const LogoutIcon = styled.div`
  position: absolute; /* Relativo ao contêiner do conteúdo */
  top: 70px; /* Espaço ajustado abaixo do header */
  right: 15px; /* Alinhado à direita com uma margem */
  cursor: pointer;
  color: #000000;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 18px;
  text-align: center;
  padding: 20px;
  background-color: #ffe6e6;
  border-radius: 5px;
  margin-top: 20px;
`;


