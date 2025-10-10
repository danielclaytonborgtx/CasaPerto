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

export const ProfileSection = styled.div`
  display: grid !important;
  grid-template-columns: auto 1fr !important;
  gap: 16px !important;
  align-items: start !important;
  width: 100%;
  background: #fff;
  border-radius: 20px;
  padding: 20px;
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

  @media (max-width: 480px) {
    padding: 16px;
    gap: 12px !important;
  }
`;

export const ProfileLeftSection = styled.div`
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: flex-start !important;
  min-width: 150px !important;
  flex-shrink: 0 !important;
  gap: 24px !important;
  width: auto !important;
  padding-top: 30px !important;

  @media (max-width: 480px) {
    min-width: 120px !important;
    gap: 38px !important;
    padding-top: 16px !important;
  }
`;

export const ProfileRightSection = styled.div`
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  width: auto !important;
  min-width: 0 !important;
`;

export const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
`;

export const ProfileIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  background-color: #ddd;
  border-radius: 50%;
  position: relative;
  cursor: pointer;

  button {
    background: none;
    border: none;
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  span {
    font-size: 36px;
    color: #fff;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;

    span {
      font-size: 30px;
    }
  }
`;

export const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;  
  align-items: center;      
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
    opacity: 0.1;
    z-index: 0;
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
  font-size: 40px;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2);
  position: relative;
  z-index: 1;
  border: 3px solid #fff;

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
    font-size: 32px;
  }
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.2);
  position: relative;
  z-index: 1;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
  }

  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

export const UserName = styled.h2`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1.2em;
  font-weight: 700;
  background: linear-gradient(135deg, #007bff 0%, #00BFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  text-align: center;
  letter-spacing: 0.3px;

  @media (max-width: 480px) {
    font-size: 1em;
  }
`;

export const UserInfo = styled.p`
  font-size: 1.2em;
  color: #666;
  text-align: center;
  margin: 0;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 1em;
  }
`;

export const UserEmail = styled.p`
  font-family: 'Poppins', sans-serif;
  font-size: 0.85em;
  color: #666;
  margin: 0;
  text-align: center;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.75em;
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

  @media (max-width: 768px) {
    top: 20px;
    left: 140px;
  }
`;

export const SectionTitle = styled.h2`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1.5em;
  font-weight: 700;
  margin-top: 50px;
  margin-bottom: 30px;
  color: #2d3748;
  width: 100%;
  text-align: center;
  position: relative;
  letter-spacing: 0.3px;
  
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
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
  line-height: 1.5;
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

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding: 20px 24px;
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  border-radius: 16px;
  border-left: 4px solid #ef4444;
  margin-top: 30px;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);

  @media (max-width: 768px) {
    font-size: 16px;
    padding: 16px 20px;
  }
`;

export const TrashIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px; 
  cursor: pointer;
  transition: transform 0.3s ease;
  font-size: 18px; 
  color: black; 
  z-index: 1;

  &:hover {
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    top: 5px;
    right: 5px;
  }
`;

export const EditIcon = styled.div`
  position: absolute;
  top: 10px; 
  right: 40px; 
  cursor: pointer;
  transition: transform 0.3s ease;
  font-size: 18px; 
  color: #1E90FF;
  z-index: 1;

  &:hover {
    transform: scale(1.2);
  }

  @media (max-width: 768px) {
    top: 5px;
    right: 35px;
  }
`;

export const BioViewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const BioViewTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1.25em;
  font-weight: 600;
  background: linear-gradient(135deg, #007bff 0%, #00BFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 16px 0;
  letter-spacing: 0.3px;
  text-align: center;
`;

export const BioViewText = styled.div`
  font-family: 'Poppins', sans-serif;
  font-size: 1em;
  line-height: 1.7;
  color: #4a5568;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #00BFFF;
  min-height: 100px;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  text-align: left;

  &.empty {
    color: #999;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-style: italic;
  }

  @media (max-width: 480px) {
    font-size: 0.95em;
    padding: 16px;
    min-height: 80px;
  }
`;
