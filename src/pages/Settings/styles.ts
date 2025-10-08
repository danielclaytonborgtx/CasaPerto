import styled from 'styled-components';

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  margin-top: 70px;
  margin-bottom: 80px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 60px;
  }
`;

export const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  padding: 32px 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #00BFFF 0%, #007bff 100%);
    border-radius: 20px 20px 0 0;
  }

  @media (max-width: 768px) {
    padding: 24px 16px;
    border-radius: 16px;
  }
`;

export const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
    opacity: 0.1;
    z-index: 0;
  }

  @media (max-width: 768px) {
    &::before {
      width: 130px;
      height: 130px;
    }
  }
`;

export const EditButton = styled.button`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  color: white;
  border: 2px solid white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  z-index: 2;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    color: white;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    
    svg {
      font-size: 14px;
    }
  }
`;

export const ProfileIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  border: 4px solid #fff;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.2);
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 123, 255, 0.3);
  }

  button {
    background: none;
    border: none;
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  span {
    font-size: 48px;
    color: #fff;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;

    span {
      font-size: 40px;
    }
  }
`;

export const UserNameSpan = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 16px;
  width: 100%;
`;

export const UserName = styled.h2`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1.5em;
  font-weight: 700;
  background: linear-gradient(135deg, #007bff 0%, #00BFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1.3em;
  }
`;

export const UserInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  margin-top: 8px;
`;

export const UserInfoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95em;
  color: #4a5568;
  border-left: 3px solid #00BFFF;

  strong {
    color: #2d3748;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.9em;
  }
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  width: 140px;
  height: 140px;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.2);
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

export const LogoutSection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const OptionItem = styled.button`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 600;
  padding: 16px 24px;
  cursor: pointer;
  font-size: 16px;
  color: white;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  width: 100%;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 14px 20px;
    font-size: 15px;
  }
`;

export const DefaultIcon = styled.span`
  font-size: 60px;
  margin-bottom: 5px;
`;

export const ErrorMessage = styled.div`
  font-family: 'Poppins', sans-serif;
  color: #ef4444;
  font-size: 16px;
  text-align: center;
  padding: 16px 20px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 12px;
  margin: 20px;
  border-left: 4px solid #ef4444;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 14px 16px;
  }
`;