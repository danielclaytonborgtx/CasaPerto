import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const BrokerList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
  width: 100%;
  max-width: 400px;
`;

export const BrokerItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f4f4f4;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  width: 100%;
`;

export const AddedBrokerList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 10px;
  width: 100%;
  max-width: 400px;
  background: #eef;
  border-radius: 5px;
  padding: 10px;
`;

export const TeamIcon = styled.div`
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

export const TeamImage = styled.img`
  border-radius: 50%;
  width: 100px;
  height: 100px;
  object-fit: cover; 
  margin-bottom: 20px;
`;

export const ListsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 900px;
  margin-top: 20px;
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  text-align: left;
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
  text-align: left; 
`;

export const AddBrokerButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 8px;
  font-size: 14px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }

  svg {
    font-size: 16px;
  }
`;
