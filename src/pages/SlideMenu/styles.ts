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
  transition: transform 0.3s ease;
  transform: translateX(${props => props.$slide}%);
`;

export const MenuContent = styled.div`
  margin-top: 60px;
`;

export const MenuItem = styled.div`
  margin-bottom: 20px;
  display: flex;
  align-items: center; 
  justify-content: flex-start; 
  
  a {
    text-decoration: none;
    color: black;
    font-size: 18px;
    padding: 10px 0;
    display: block;
    width: 100%; 
    padding-left: 5px; 
    
    &:hover {
      color: #000;
      background-color: rgba(0, 0, 0, 0.1);
    }
  }

  &.user {
    font-weight: bold;
    color: #333; 
  }
`;

export const UserNameSpan = styled.span`
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px; 
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover; 
`;

export const DefaultIcon = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
`;
