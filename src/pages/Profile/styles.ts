import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
  margin-top: 70px;
  margin-bottom: 80px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
`;

export const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;  
  align-items: center;      
  margin-bottom: 20px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
    opacity: 0.1;
    z-index: 0;
  }
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 4px solid #fff;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.2);
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
  }
`;

export const UserName = styled.h1`
  font-size: 1.8em;
  font-weight: 700;
  background: linear-gradient(135deg, #007bff 0%, #00BFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 8px 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.4em;
  }
`;

export const UserInfo = styled.p`
  font-size: 1em;
  color: #666;
  margin-bottom: 10px;
  font-weight: 500;
`;

export const ButtonContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  width: 100%;
  max-width: 600px;
  margin-top: 30px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
    max-width: 100%;
    padding: 0 10px;
  }
`;

export const StyledButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px 12px;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  color: black;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.35);
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(-2px);
  }

  svg {
    font-size: 28px;
    margin-bottom: 8px;
    color: black;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  span {
    font-size: 13px;
    font-weight: 600;
    color: black;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 10px 4px;

    svg {
      font-size: 18px;
      margin-bottom: 4px;
    }

    span {
      font-size: 9px;
    }
  }
`;

export const LogoutIcon = styled.div`
  position: relative; 
  top: 30px; 
  left: 180px; 
  cursor: pointer;
  color: #000;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5em;
  font-weight: 700;
  margin-top: 50px;
  margin-bottom: 30px;
  color: #2d3748;
  width: 100%;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -12px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #00BFFF 0%, #007bff 100%);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 1.2em;
    margin-top: 35px;
    margin-bottom: 25px;
  }
`;

export const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
`;

export const PropertyItem = styled.li`
  width: 100%;
  display: grid;
  align-items: flex-start;
  padding: 20px;
  margin: 20px 0;
  border: none;
  border-radius: 20px;
  background: #fff;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #00BFFF 0%, #007bff 100%);
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 123, 255, 0.15);
  }

  @media (max-width: 768px) {
    padding: 16px;
    margin: 16px 0;
    border-radius: 16px;
  }
`;

export const PropertyItemLayout = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  gap: 12px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PropertyImageContainer = styled.div`
  width: 140px;
  height: 140px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 16px;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  margin-right: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 220px;
    margin-right: 0;
    margin-bottom: 16px;
  }
`;

export const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 16px;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const TitlePriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  flex: 1;
  gap: 8px;
  
  strong {
    font-size: 1.4em;
    font-weight: 700;
    color: #2d3748;
    line-height: 1.3;

    @media (max-width: 768px) {
      font-size: 1.2em;
    }
  }

  p {
    margin: 0;
    color: #10b981;
    font-size: 1.3em;
    font-weight: 700;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 1.1em;
    }
  }
`;

export const PropertyDetails = styled.div`
  white-space: pre-line;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 100px;
  flex-wrap: wrap;
  word-break: break-word;
  padding: 16px 20px;
  margin-top: 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border-left: 3px solid #00BFFF;
  
  strong {
    font-size: 1.1em;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 6px;

    @media (max-width: 768px) {
      font-size: 1em;
    }
  }

  p {
    margin: 0;
    color: #4a5568;
    line-height: 1.6;
    max-width: 100%;
    flex-grow: 1;

    @media (max-width: 768px) {
      font-size: 0.9em;
    }
  }
`;

export const Loading = styled.div`
  font-size: 1.5em;
  color: #888;
  padding: 20px;
  margin-top: 50px;
  text-align: center;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 1.2em;
  }
`;

export const TrashIcon = styled.div`
  position: absolute;
  top: 24px;
  right: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 18px;
  color: #ef4444;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.1);

  &:hover {
    transform: translateY(-2px);
    background: rgba(239, 68, 68, 0.2);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 16px;
    width: 36px;
    height: 36px;
  }
`;

export const EditIcon = styled.div`
  position: absolute;
  top: 24px;
  right: 70px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 18px;
  color: #007bff;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: rgba(0, 123, 255, 0.1);

  &:hover {
    transform: translateY(-2px);
    background: rgba(0, 123, 255, 0.2);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 768px) {
    top: 16px;
    right: 60px;
    width: 36px;
    height: 36px;
  }
`;

export const DefaultIcon = styled.span`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 50px;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.2);
  position: relative;
  z-index: 1;
  border: 4px solid #fff;

  @media (max-width: 768px) {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }
`;

export const PriceAndMapContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%; 
  gap: 16px;

  p {
    margin: 0;
    padding: 0;
    line-height: 1;
  }
`;

export const MapLink = styled.a`
  color: #007bff;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgba(0, 123, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: rgba(0, 123, 255, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  }
`;

