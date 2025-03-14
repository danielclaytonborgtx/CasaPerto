import styled from 'styled-components';

export const TeamContainer = styled.div`
  padding: 20px;
  margin-top: 50px;

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
    text-align: center;
  }
`;

export const CreateTeamButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;

  display: block;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background-color: #0056b3;
  }
`;

export const TeamCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  position: relative;
  width: 95vw; 
  max-width: 100%; 
  box-sizing: border-box;
`;

export const TeamImage = styled.img`
  width: 170px;
  height: 170px;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 20px;
`;

export const TeamDetails = styled.div`
  flex: 1;
  text-align: left;
`;

export const TeamMembers = styled.div`
  margin-top: 10px;
  
  ul {
    list-style-type: none; 
    padding-left: 0;
  }
  
  li {
    padding: 5px 0;
  }
`;

export const TeamName = styled.h1`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const UserTag = styled.strong`
  display: block;
  color: green;
  margin-top: 5px;
`;

export const EditIcon = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  color: #007bff;
  font-size: 1.5rem; 
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
  }
`;


