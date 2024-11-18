import React from 'react';
import { useLocation } from 'react-router-dom'; // Para acessar o estado da navegação
import Slider from 'react-slick';
import { Container, ImageWrapper, Image, Title, Price, Description, SliderContainer } from './styles';

interface PropertyDetailsProps {
  title: string;
  price: string;
  description: string;
  images: string[]; // Array de URLs de imagens
}

const PropertyDetails: React.FC = () => {
  const location = useLocation(); // Usando useLocation para pegar o estado passado
  const { title, price, description, images } = location.state as PropertyDetailsProps; // Pegando as propriedades do imóvel

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <Container>
      <SliderContainer>
        <Slider {...settings}>
          {images.map((img, index) => (
            <ImageWrapper key={index}>
              <Image src={img} alt={`Imagem do imóvel ${index + 1}`} />
            </ImageWrapper>
          ))}
        </Slider>
      </SliderContainer>

      <Title>{title}</Title>
      <Price>{price}</Price>
      <Description>{description}</Description>
    </Container>
  );
};

export default PropertyDetails;
