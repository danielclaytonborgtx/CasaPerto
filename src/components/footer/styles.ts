import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 20px;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 -4px 12px rgba(0, 123, 255, 0.25);
  
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
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const ButtonContent = styled.div`
  display: flex;
  align-items: center;
`;

export const ButtonText = styled.span`
  color: black;
  margin-left: 8px;
  font-size: 16px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
`;
