import styled from "styled-components";

export const BrokersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-bottom: 30px;
  margin-top: 50px;
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  width: 80px;
  height: 80px;
  object-fit: cover;  
`;

export const MessageButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border: none;
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  z-index: 2;
  min-width: 44px;
  min-height: 44px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const BrokerList = styled.ul`
  list-style: none;
  padding: 0;
  width: 100%;
`;

export const BrokerItem = styled.li`
  display: flex;
  align-items: center;
  background: #f8f9fa;
  padding: 20px;
  margin: 10px 0;
  border-radius: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  gap: 20px;
  position: relative;
  min-height: 120px;

  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

export const BrokerDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 15px;
  gap: 8px;
  flex: 1;
  padding-right: 60px; /* Espaço para o ícone de mensagem */
  min-width: 0; /* Permite que o texto quebre se necessário */
`;

export const ProfileLink = styled.strong`
  cursor: pointer;
  color: #3b82f6;
  font-size: 14px; 
  margin-top: 8px; 
  display: inline-block; 
  
  &:hover {
    text-decoration: underline;
    color: #1d4ed8;
  }
`;

export const BrokerName = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  word-break: break-word;
  line-height: 1.3;
`;

export const BrokerId = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
`;

export const BrokerEmail = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  word-break: break-all;
  line-height: 1.4;
`;

export const BrokerIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #007bff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 50px;
`;

export const Loading = styled.p`
  font-size: 18px;
  color: #007bff;
  margin-top: 20px;
`;

export const ErrorMessage = styled.p`
  font-size: 16px;
  color: red;
  margin-top: 20px;
`;

export const SearchInput = styled.input`
  width: 90%;
  max-width: 400px;
  padding: 10px;
  margin-bottom: 20px;
  margin-top: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
