import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin-top: 80px;
  margin-bottom: 80px;
  width: 100%;
  box-sizing: border-box;
`;

export const UserName = styled.h1`
  font-size: 2em;
  color: #333;
  margin-bottom: 10px;
  margin-top: 20px;
`;

export const UserInfo = styled.p`
  font-size: 1.2em;
  color: #555;
  margin-bottom: 10px;
`;

export const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
  font-size: 1em;
  color: #333;
`;

export const PropertyItem = styled.li`
  width: 100%; 
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  position: relative; 
  min-width: 400px;
`;

export const PropertyImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-right: 15px;
`;

export const PropertyDetails = styled.div`
  flex-grow: 1;
  text-align: left;
  strong {
    font-size: 1.1em;
    color: #333;
  }
  p {
    margin: 5px 0;
    color: #555;
  }
`;

export const Loading = styled.div`
  font-size: 1.5em;
  color: #888;
  padding: 20px;
`;

export const LogoutIcon = styled.div`
  margin-left: 330px;
  top: 10px;
  cursor: pointer;
  color: #000;
  transition: transform 0.2s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 18px;
  text-align: center;
  padding: 20px;
  background-color: #ffe6e6;
  border-radius: 5px;
  margin-top: 20px;
`;

export const TrashIcon = styled.div`
  position: absolute;
 top: 10px;
  right: 10px; 
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 18px; 
  color: black; 

  &:hover {
    transform: scale(1.2);
  }
`;

export const EditIcon = styled.div`
  position: absolute;
  top: 10px; 
  right: 35px; 
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 18px; 
  color: black;

  &:hover {
    transform: scale(1.2);
  }
`;
