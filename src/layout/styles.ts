import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Garantir que o layout ocupe a altura total da tela */
`;

export const MainContent = styled.main`
  flex-grow: 1; /* O conteúdo principal ocupa o espaço restante */
  padding: 20px;
  padding-top: 80px; /* Ajuste conforme a altura do seu cabeçalho */
  padding-bottom: 80px; /* Ajuste conforme a altura do seu rodapé */
  box-sizing: border-box;
  overflow-y: auto; /* Habilita rolagem caso o conteúdo ultrapasse o limite da tela */
  display: flex;
  flex-direction: column;
  align-items: center; /* Centraliza o conteúdo horizontalmente */
  justify-content: flex-start; /* Alinha o conteúdo no topo da área disponível */

  /* Responsividade */
  @media (max-width: 768px) {
    padding-top: 60px; /* Menos espaçamento em telas menores */
    padding-bottom: 60px;
  }
`;
