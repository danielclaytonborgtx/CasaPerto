import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Garante que a tela ocupe toda a altura da janela */

  .map-container {
    flex-grow: 1; /* O mapa irá preencher o espaço restante */
    padding: 20px;
    height: calc(100vh - 60px - 60px); /* Subtrai a altura do header e footer */
    /* Isso garante que o mapa ocupe toda a altura disponível entre o header e o footer */
  }
`;
