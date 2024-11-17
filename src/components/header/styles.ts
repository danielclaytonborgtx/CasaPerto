import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background-color: #FF7F50;
  border-bottom: 1px solid #000000;
  width: 100%;
  position: relative;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 10px 5px;
  }
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  font-size: 30px;
  color: black;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  height: 35px;
  padding: 0 10px;
  font-size: 14px;
  border: 1px solid #000;
  border-radius: 5px;
  background-color: #fff;

  @media (max-width: 768px) {
    height: 30px;
    font-size: 12px;
  }
`;

export const AddButton = styled.button`
  background: none;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 30px;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

export const Icon = styled.span`
  font-size: inherit;
  color: black;

  @media (max-width: 768px) {
    font-size: 22px; // Ajuste para ícones menores em telas pequenas
  }
`;

