// styles.ts
import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0; /* Remover padding do container para ocupar toda a largura */
  margin-top: 80px; /* Ajuste para o header */
  margin-bottom: 80px; /* Ajuste para o footer */
  width: 100%; /* Garantir que o container ocupe 100% da largura */
  box-sizing: border-box; /* Inclui o padding e a borda no cálculo da largura */
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%; /* Reduz a largura para 90% da tela */
  max-width: 1200px; /* Tamanho máximo para evitar que a imagem fique grande demais */
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

export const Image = styled.img`
  width: 100%; /* Faz a imagem ocupar 100% da largura do item */
  height: 200px;
  object-fit: cover; /* Garante que a imagem ocupe totalmente o espaço sem distorção */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const Title = styled.h3`
  font-size: 18px;
  margin: 10px;
  text-align: center;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  border-radius: 0 0 8px 8px;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;
