import styled from 'styled-components';

export const SlideMenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 70%; /* Menu ocupa 70% da largura da tela */
  height: 100%;
  background-color: #FFA07A; /* Cor de fundo */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  padding: 20px;
  z-index: 1000;
  transition: transform 0.3s ease; /* Transição suave */
  display: flex;
  flex-direction: column; /* Para alinhar os itens verticalmente */
`;

export const MenuItem = styled.div`
  margin-bottom: 20px; /* Espaçamento entre os itens */
  
  a {
    text-decoration: none;
    color: black; /* Alterado para cor preta */
    font-size: 18px;
    padding: 10px 0; /* Espaçamento interno */
    display: block; /* Para garantir que o link ocupe a área inteira do item */
    
    &:hover {
      color: #000; /* Continua preto ao passar o mouse */
      background-color: rgba(0, 0, 0, 0.1); /* Fundo leve ao passar o mouse */
    }
  }
`;

export const MenuContent = styled.div`
  margin-top: 60px; /* Ajuste de espaçamento superior */
  
  p {
    margin: 10px 0;
    font-size: 18px;
    color: black; /* Alterado para cor preta */
    cursor: pointer;
  }
`;
