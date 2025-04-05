import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin-top: 70px;
  margin-bottom: 40px;
  width: 100%;
  box-sizing: border-box;
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
`;

export const ProfileImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;  
  align-items: center;      
  margin-bottom: 10px;      
`;

export const DefaultIcon = styled.span`
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

export const ProfileImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover;  
`;

export const UserName = styled.h1`
  font-size: 1.2em;
  color: #333;
  margin-top: 10px;
`;

export const UserInfo = styled.p`
  font-size: 1em;
  color: #555;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;  
  width: 90%;                    
  margin-top: 20px;               
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
  font-size: 1.1em;
  font-weight: bold;
  margin-top: 20px; 
  color: #333; 
`;

export const UserList = styled.ul`
  list-style-type: none;
  padding: 0;
  font-size: 1em;
  color: #333;
`;

export const PropertyItem = styled.li`
  width: 100%;
  display: grid;
  align-items: flex-start;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fff;
  position: relative;
`;

export const PropertyItemLayout = styled.div`
  display: flex;
  align-items: center; 
  justify-content: flex-start;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  background-color: #fff;
  width: 100%;
`;

export const PropertyImageContainer = styled.div`
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 5px;
  background-color: #f0f0f0;
  margin-right: 15px;
  margin-bottom: 10px;
`;

export const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

export const TitlePriceContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  
  strong {
    font-size: 1.5em;
    color: #333;
  }

  p {
    margin-top: 15px;
    margin-bottom: 0;
    color: green;
    font-size: 1.2em;
    font-weight: bold;
  }
`;

export const PropertyDetails = styled.div`
  white-space: pre-line; 
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: 120px; 
  flex-wrap: wrap; 
  word-break: break-word;
  padding: 0 15px;
  
  strong {
    font-size: 1.1em;
    color: #333;
  }

  p {
    margin: 0 0 10px 0;
    color: #555;
    max-width: 100%;
    flex-grow: 1;
  }
`;

export const Loading = styled.div`
  font-size: 1.5em;
  color: #888;
  padding: 20px;
  margin-top: 50px;
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
  right: 40px; 
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 18px; 
  color: black;

  &:hover {
    transform: scale(1.2);
  }
`;
