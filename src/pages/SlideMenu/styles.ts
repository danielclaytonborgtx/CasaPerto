import styled from 'styled-components';

interface SlideMenuContainerProps {
  $slide: number;
}

export const SlideMenuContainer = styled.div<SlideMenuContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 70%;
  height: 100%;
  background-color: #ADD8E6;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
  padding: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease; /* Transição suave */
  transform: translateX(${props => props.$slide}%); /* Controle do movimento */
`;

export const MenuItem = styled.div`
  margin-bottom: 20px;
  
  a {
    text-decoration: none;
    color: black;
    font-size: 18px;
    padding: 10px 0;
    display: block;
    
    &:hover {
      color: #000;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }
`;

export const MenuContent = styled.div`
  margin-top: 60px;
  
  p {
    margin: 10px 0;
    font-size: 18px;
    color: black;
    cursor: pointer;
  }
`;
