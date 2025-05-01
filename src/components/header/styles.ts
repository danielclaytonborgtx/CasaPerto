import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 1px;
  background-color: #87CEEB;
  border-bottom: 1px solid #000000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 40px;
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
  border-radius: 50%;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3); 
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4); 
  }
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
  border-radius: 50%; 
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4); 
  }
`;

export const Icon = styled.span`
  font-size: 25px;
  color: black;
`;

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  padding: 1.5px;
  border-radius: 20px;      
`;

export const SwitchLabel = styled.span<{ position: 'left' | 'right' }>`
  font-size: 20px;
  color: black;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 110%;
  width: 100%;
  position: absolute;
  ${({ position }) => position === 'left' ? 'left: -58px;' : 'right: -56px;'}
  top: 2px;
  text-align: center;
`;





