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
  border-radius: 20%;
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #007bff;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #007bff;

  &:hover {
    color: #0056b3;
  }

  z-index: 1; 
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
  padding: 15px;
  margin: 10px 0;
  border-radius: 8px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  transition: 0.3s;
  gap: 15px;
  position: relative; 

  &:hover {
    background: #e9ecef;
  }
`;

export const BrokerDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 15px; 
  gap: 5px;
`;

export const ProfileLink = styled.strong`
  cursor: pointer;
  color: blue;
  font-size: 14px; 
  margin-top: 8px; 
  display: inline-block; 
  
  &:hover {
    text-decoration: underline;
  }
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