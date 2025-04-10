import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh; 
  margin-top: 40px; 
  margin-bottom: 40px;
  padding: 0; 

  .map-container {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
  }
`;

export const UpdateButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 10px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 60px;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

export const LoginMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 18px;
  color: #666;
  text-align: center;
  padding: 20px;
`;


