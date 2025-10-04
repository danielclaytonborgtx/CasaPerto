import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh; /* Garantir que o layout ocupe a altura total da tela */
`;

export const MainContent = styled.main`
  flex-grow: 1; /* O conteúdo principal ocupa o espaço restante */
  padding: 0; /* Remove o padding original */
  box-sizing: border-box;
  overflow-y: auto; /* Habilita rolagem caso o conteúdo ultrapasse o limite da tela */
  display: flex;
  flex-direction: column;
  align-items: stretch; /* Permite que o conteúdo use toda a largura disponível */
  justify-content: flex-start; /* Alinha o conteúdo no topo da área disponível */

  height: calc(100vh - 80px - 80px); /* Subtrai as alturas do Header e Footer */
  
  /* Responsividade */
  @media (max-width: 768px) {
    height: calc(100vh - 60px - 60px); /* Menos altura em telas menores */
  }
`;
