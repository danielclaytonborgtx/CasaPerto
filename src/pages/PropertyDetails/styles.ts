import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
`;

export const SliderContainer = styled.div`
  width: 100%;
  height: 400px; /* Defina uma altura para o slider */
  margin-bottom: 20px; /* Espaço entre o slider e as informações */
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Faz a imagem cobrir o espaço do contêiner sem distorcer */
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
`;

export const Price = styled.p`
  font-size: 20px;
  color: green;
  font-weight: bold;
  margin-bottom: 10px;
`;

export const Description = styled.p`
  font-size: 16px;
  text-align: justify;
  color: #555;
  max-width: 800px;
  margin-bottom: 30px;
`;
