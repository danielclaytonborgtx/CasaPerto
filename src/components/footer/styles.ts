import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 20px;
  background-color: #87CEEB;
  border-top: 1px solid #000000;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 5px 10px; 
  }
  
  body {
    margin: 0;
    padding: 0;
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 50px;
  border-radius: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #00BFFF;
  }
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
`;

export const ButtonText = styled.span`
  color: #000000;
  margin-left: 8px;
  font-size: 16px;
`;
