import styled from "styled-components";

// Container para o mapa, deve ocupar 100% da altura e largura disponível
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh; /* O container vai ocupar toda a altura da tela */
  margin-top: 60px; /* Espaço reservado para o header de 10px */
  margin-bottom: 50px; /* Espaço reservado para o footer de 10px */
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
