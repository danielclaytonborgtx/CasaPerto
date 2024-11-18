import styled from "styled-components";

// Container para o mapa, deve ocupar 100% da altura e largura disponível
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh; /* O container vai ocupar toda a altura da tela */
  margin: 0; /* Remove qualquer margem indesejada */
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
