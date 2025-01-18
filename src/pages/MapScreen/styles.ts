import styled from "styled-components";

// Container para o mapa, deve ocupar 100% da altura e largura disponível
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh; /* O container vai ocupar toda a altura da tela */
  margin-top: 60px; /* Espaço reservado para o header */
  margin-bottom: 50px; /* Espaço reservado para o footer */
  padding: 0; /* Remove qualquer padding adicional */

  /* Garante que o mapa ocupe o restante do espaço */
  .map-container {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* Garante que o padding e margin não interfiram na largura/altura */
  }
`;

export const UpdateButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 10px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 60px;
`;

// Estilos do InfoWindow
export const InfoWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 250px; /* Largura fixa */
  height: 200px; /* Altura fixa */
  padding: 10px;
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

export const NavigationIconContainer = styled.div`
  position: absolute;
  top: 5px; /* Ajustado para ficar mais para cima */
  left: 10px;
  z-index: 20;
  cursor: pointer;
`;

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px; /* Espaço para o ícone de navegação */
`;

export const PropertyImage = styled.img`
  width: 100%; /* Agora ocupa 100% da largura do container */
  height: auto; /* Ajusta a altura proporcionalmente */
  object-fit: cover;
  cursor: pointer;
`;
