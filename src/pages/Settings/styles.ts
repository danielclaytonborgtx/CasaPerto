import styled from 'styled-components';

export const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center; 
  padding: 10px;
  margin-top: 60px;
`;

export const OptionItem = styled.div`
font-weight: bold;
  padding: 10px;
  cursor: pointer;
  font-size: 16px;
  color: red;
  &:hover {
    border-radius: 10%;
    background-color: #f0f0f0;
  }
`;

export const EditButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  /* background: rgba(0, 0, 0, 0.6); */
  color: black;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background: #ddd;
  }
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

export const UserNameSpan = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 20px;
  gap: 20px;
`;

export const ProfileImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover; 
  margin-bottom: 20px;
`;

export const DefaultIcon = styled.span`
  font-size: 60px;
  margin-bottom: 5px; 
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