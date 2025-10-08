import styled from 'styled-components';

interface SlideMenuContainerProps {
  $slide: number;
}

export const SlideMenuContainer = styled.div<SlideMenuContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 75%;
  height: 100%;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  box-shadow: 4px 0 20px rgba(0, 123, 255, 0.3);
  padding: 30px 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateX(${props => props.$slide}%);
  overflow-y: auto;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
    pointer-events: none;
  }
`;

export const MenuContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%; 
  margin-top: 40px;
  gap: 8px;
  position: relative;
  z-index: 2;
`;

export const MenuItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 20px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  a {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-decoration: none;
    color: black;
    font-size: 16px;
    font-weight: 600;
    padding: 0;
    display: block;
    text-align: center;
    width: 100%;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    letter-spacing: 0.2px;
    
    &:hover {
      color: black;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }

  &.user {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    font-weight: 700;
    color: white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: translateX(8px);
    }
  }
`;

export const UserNameSpan = styled.span`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  cursor: pointer;
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: black;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  letter-spacing: 0.3px;

  &:hover {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  width: 50px;
  height: 50px;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
`;

export const DefaultIcon = styled.span`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #007bff;
  font-size: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
`;
