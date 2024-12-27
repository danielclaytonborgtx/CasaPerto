import React from 'react';
import { useLocation } from 'react-router-dom';
import Slider from 'react-slick';
import {
  Container,
  ContentWrapper,
  SliderContainer,
  ImageWrapper,
  Image,
  Title,
  Price,
  Description,
} from './styles';

const API_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_REACT_APP_API_URL;
interface PropertyDetailsProps {
  title: string;
  price: number;
  description: string;
  images: string[]; // Array de URLs de imagens
}

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  const { title, price, description, images } = location.state as PropertyDetailsProps;

  const settings = {
    dots: true,
    infinite: images.length > 1, // Apenas ativa o loop infinito se houver mais de uma imagem
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true, // Ajusta a altura do slider com base no conteúdo
    arrows: true, // Exibe as setas de navegação (caso necessário)
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <Container>
      <ContentWrapper>
        <SliderContainer>
          <Slider {...settings}>
            {images.map((img, index) => (
              <ImageWrapper key={index}>
                <Image src={`${API_URL}${img}`} alt={`Imagem do imóvel ${index + 1}`} />
              </ImageWrapper>
            ))}
          </Slider>
        </SliderContainer>

        <Title>{title}</Title>
        <Price>{formatPrice(price)}</Price>
        <Description>{description}</Description>
      </ContentWrapper>
    </Container>
  );
};

export default PropertyDetails;
