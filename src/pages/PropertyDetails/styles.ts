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
  height: auto; 
  margin-bottom: 40px; 
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 350px;
  overflow: hidden;
  border-radius: 10px;
  margin: 0; 
  padding: 0; 
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center; 
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  word-wrap: break-word; 
`;

export const Price = styled.p`
  font-size: 20px;
  color: green;
  font-weight: bold;
  margin: 0; 
  padding: 0; 
  word-wrap: break-word;
  margin-bottom: 30px;
`;

export const Description = styled.p`
  font-size: 16px;
  text-align: justify;
  color: #555;
  max-width: 800px;
  margin-bottom: 30px;
  line-height: 1.5;
`;

export const FooterText = styled.p`
  font-size: 12px;
  color: #555;
  margin-top: 20px;
  text-align: center;
  cursor: pointer;
`;

