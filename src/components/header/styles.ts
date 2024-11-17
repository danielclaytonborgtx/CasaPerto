import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #FF7F50;
  border-bottom: 1px solid #000000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 60px; 
`;

export const MenuButton = styled.button`
  font-size: 30px;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  display: flex;
  justify-content: center; 
  align-items: center;       
  padding: 0;                
  margin: 0;                 
  margin-right: 20px;
`;


export const SearchInput = styled.input`
  flex: 1;
  height: 35px;
  border-color: #000;
  border-width: 1px;
  border-radius: 5px;
  padding-left: 10px;
  background-color: #fff;
  margin-top: 5px;
`;

export const AddButton = styled.button`
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border: none;
  cursor: pointer;
  margin-left: 10px;
`;

export const Icon = styled.span`
  font-size: 20px;
  color: black;
`;
