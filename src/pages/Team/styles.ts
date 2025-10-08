import styled from 'styled-components';

export const TeamContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 70px;
  margin-bottom: 80px;
  width: 100%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 60px;
  }
`;

export const PageTitle = styled.h2`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 2em;
  font-weight: 700;
  background: linear-gradient(135deg, #007bff 0%, #00BFFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 30px;
  text-align: center;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 1.5em;
    margin-bottom: 20px;
  }
`;

export const CreateTeamButton = styled.button`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  color: black;
  border: none;
  padding: 14px 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 30px;
  width: 100%;
  max-width: 300px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 12px 24px;
    font-size: 15px;
    max-width: 100%;
  }
`;

export const InvitationsSection = styled.div`
  width: 100%;
  margin-bottom: 30px;
`;

export const InvitationsTitle = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1.3em;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;

export const InfoBox = styled.div`
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
  border: 1px solid #2196f3;
  border-left: 4px solid #2196f3;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 20px;
  color: #1976d2;

  strong {
    display: block;
    margin-bottom: 8px;
    font-size: 1em;
  }

  p {
    margin: 0;
    font-size: 0.9em;
    color: #1565c0;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

export const InvitationCard = styled.div`
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 123, 255, 0.1);
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
  }
`;

export const InvitationContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const InvitationInfo = styled.div`
  flex: 1;

  strong {
    display: block;
    font-size: 1.1em;
    color: #2d3748;
    margin-bottom: 6px;
  }

  p {
    margin: 0;
    color: #666;
    font-size: 0.9em;
  }
`;

export const InvitationButtons = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 768px) {
    width: 100%;
    
    button {
      flex: 1;
    }
  }
`;

export const TeamCard = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #00BFFF 0%, #007bff 100%);
    border-radius: 16px 16px 0 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(0, 123, 255, 0.15);
  }

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

export const TeamCardContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const TeamLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 140px;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const TeamImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

export const TeamInfo = styled.div`
  text-align: center;
  width: 100%;
`;

export const TeamName = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1.2em;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 6px 0;

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;

export const UserTag = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-size: 0.75em;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
  margin-top: 4px;
`;

export const TeamActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  width: 100%;
`;

export const TeamRightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const MembersTitle = styled.h4`
  margin: 0 0 12px 0;
  font-size: 0.95em;
  color: #666;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
`;

export const TeamMembers = styled.div`
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  li {
    padding: 10px 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-radius: 8px;
    font-size: 0.9em;
    border-left: 3px solid #00BFFF;
    color: #4a5568;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
      transform: translateX(4px);
    }
  }

  p {
    color: #999;
    font-size: 0.9em;
    margin: 0;
    font-style: italic;
  }
`;

export const TeamsSection = styled.div`
  width: 100%;
`;

export const EditIcon = styled.button`
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(0, 123, 255, 0.1);
  color: #007bff;
  border: 1px solid #007bff;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  svg {
    font-size: 16px;
  }

  &:hover {
    background: #007bff;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

export const AcceptButton = styled.button`
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85em;
  }
`;

export const RejectButton = styled.button`
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.85em;
  }
`;

export const LeaveButton = styled.button`
  font-family: 'Inter', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85em;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;

  svg {
    font-size: 16px;
  }

  &:hover {
    background: #ef4444;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;


