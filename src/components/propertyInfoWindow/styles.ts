import styled from 'styled-components';

export const NavigationIconContainer = styled.div`
  position: absolute;
  top: 5px; 
  left: 10px;
  z-index: 20;
  cursor: pointer;
`;

export const PropertyImage = styled.img`
  width: 180px; 
  height: 200px; 
  object-fit: cover;
  cursor: pointer;
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