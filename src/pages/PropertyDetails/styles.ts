import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-bottom: 60px
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
  margin-top: 80px;
`;

export const SliderContainer = styled.div`
  width: 100%;
  height: 500px; /* Manter uma altura fixa para o slide */
  margin-bottom: 20px;
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover; /* Faz a imagem cobrir o espaço do contêiner sem distorcer */
  object-position: center center; /* Centraliza a imagem para evitar cortes indesejados */
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 10px 0;
  word-wrap: break-word; /* Garante que o texto não ultrapasse a largura */
`;

export const Price = styled.p`
  font-size: 20px;
  color: green;
  font-weight: bold;
  margin-bottom: 10px;
  word-wrap: break-word; /* Garante que o texto não ultrapasse a largura */
`;

export const Description = styled.p`
  font-size: 16px;
  text-align: justify;
  color: #555;
  max-width: 800px;
  margin-bottom: 30px;
  line-height: 1.5;
`;
