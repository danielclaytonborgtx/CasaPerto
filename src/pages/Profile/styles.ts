import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
`;

export const LogoutButton = styled.button`
  background-color: #ff4757;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
`;

export const LogoutButtonText = styled.span`
  font-weight: bold;
`;

export const Loading = styled.div`
  font-size: 18px;
  color: #000;
`;

export const ErrorText = styled.p`
  color: red;
  text-align: center;
  margin-bottom: 16px;
`;

export const NoImoveisText = styled.p`
  text-align: center;
  font-size: 18px;
  color: #888;
`;

export const ImoveisList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PropertyCard = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #f9f9f9;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const PropertyDetails = styled.div`
  flex: 1;
  padding-right: 10px;
  cursor: pointer;
`;

export const PropertyTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
`;

export const PropertyValue = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-top: 5px;
  margin-bottom: 5px;
`;

export const PropertyDescription = styled.p`
  font-size: 14px;
  color: #666;
`;

export const ImagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const Image = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 5px;
  cursor: pointer;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
`;

export const DeleteIcon = styled.div`
  cursor: pointer;
`;
