import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh; 
  margin-top: 50px; 
  margin-bottom: 50px;
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

export const InfoWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 190px; 
  height: 280px; 
  padding: 10px;
  position: relative;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
`;

export const NavigationIconContainer = styled.div`
  position: absolute;
  top: 5px; 
  left: 10px;
  z-index: 20;
  cursor: pointer;
`;

export const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 30px;

  p {
    color: green; 
    font-weight: bold;
  }

  p:nth-of-type(2) {
    color: black; 
  }

  p:nth-of-type(3) {
    color: black;
  }
`;

export const PropertyImage = styled.img`
  width: 180px; 
  height: 200px; 
  object-fit: cover;
  cursor: pointer;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;