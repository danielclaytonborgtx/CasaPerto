import styled from 'styled-components';

export const PropertyImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`;

export const InfoWindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

export const InfoContent = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const Price = styled.p`
  margin: 0;
  color: #2e7d32;
  font-weight: bold;
  font-size: 15px;
`;

export const PriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  svg {
    color: #1976d2;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      transform: scale(1.1);
    }
  }
`;