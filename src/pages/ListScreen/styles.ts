import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin-top: 80px;
  margin-bottom: 80px;
  width: 100%;
  box-sizing: border-box;
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 1200px;
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
  width: 100%; /* Imagem ocupa 100% da largura do item */
  height: 250px; /* Ajuste a altura para que a imagem ocupe mais espaço vertical */
  object-fit: cover; /* Garante que a imagem ocupe o espaço sem distorcer */
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
  font-size: 14px; /* Texto menor para o botão */
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;
