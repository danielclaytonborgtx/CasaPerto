import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f8f8f8;
`;

export const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const UserInfo = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 80%;
  text-align: left;
`;

export const LogoutButton = styled.button`
  padding: 10px 20px;
  background-color: #ff6347;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #ff4500;
  }
`;

export const ImoveisList = styled.div`
  margin-top: 30px;
  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
  div {
    margin-bottom: 20px;
  }
  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
  }
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 1.2rem;
  text-align: center;
`;
