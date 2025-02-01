import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 10px;
  background-color: #87CEEB;
  border-bottom: 1px solid #000000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 50px;
`;

export const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px; 
  width: 45px; 
  margin-right: 15px;
  margin-top: 8px;
`;

export const AddButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  height: 45px;
  width: 45px;  
  margin-left: 15px;
  margin-top: 8px;
`;

export const Icon = styled.span`
  font-size: 25px;
  color: black;
`;

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; // Garante que o Switch fique centralizado
`;





