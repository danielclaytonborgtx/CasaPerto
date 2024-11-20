import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #87CEEB;
  border-bottom: 1px solid #000000;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 60px;
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

export const SearchInput = styled.input`
  flex: 1;
  height: 35px;
  border: 1px solid #000;
  border-radius: 5px;
  padding-left: 30px;  
  padding-right: 30px; 
  background-color: #fff;
  margin-top: 3px;
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
