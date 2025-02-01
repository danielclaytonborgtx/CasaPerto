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
  width: 100%; 
  height: 250px; 
  object-fit: cover; 
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const Title = styled.h3`
  font-size: 18px;
  margin: 10px;
  text-align: center;
`;

export const Price = styled.p`
  color: green; 
  font-size: 1.2em;
  margin-top: 5px;
  font-weight: bold;
`;

export const Button = styled.button`
  background-color: #00BFFF;
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  border-radius: 0 0 8px 8px;
  font-size: 14px; 
  transition: background-color 0.3s;

  &:hover {
    background-color: #87CEEB;
  }
`;
