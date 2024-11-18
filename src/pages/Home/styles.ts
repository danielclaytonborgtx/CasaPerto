import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;
`;

export const Image = styled.img`
  width: 300px;
  height: 200px;
  border-radius: 10px;
  margin-bottom: 20px;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

export const Description = styled.p`
  font-size: 16px;
  color: #666;
  text-align: center;
  line-height: 1.5;
  max-width: 400px;
`;
