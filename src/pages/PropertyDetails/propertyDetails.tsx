import React from "react";
import { useLocation } from "react-router-dom";
import Slider from "react-slick";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Container,
  ContentWrapper,
  SliderContainer,
  ImageWrapper,
  Image,
  Title,
  Price,
  Description,
  FooterText,
} from "./styles";

interface PropertyDetailsProps {
  title: string;
  price: number;
  description: string;
  images: { url: string }[]; 
  user?: { username: string }; 
  createdAt: string; 
}

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  const property = location.state as PropertyDetailsProps;

  if (!property) {
    return <p>Erro: Nenhuma propriedade foi encontrada.</p>;
  }

  const { title, price, description, images, user, createdAt } = property;

  console.log("Dados recebidos:", property);

  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: true,
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDate = (date: string) => {
    try {
      const parsedDate = parseISO(date);
      return format(parsedDate, "dd MMMM yyyy", { locale: ptBR });
    } catch {
      return "Data inválida";
    }
  };

  const username = user?.username || "Usuário desconhecido";

  return (
    <Container>
      <ContentWrapper>
        <SliderContainer>
          <Slider {...settings}>
            {images.map((img, index) => (
              <ImageWrapper key={index}>
                <Image
                  src={`https://server-2-production.up.railway.app${img}`}
                  alt={`Imagem do imóvel ${index + 1}`}
                />
              </ImageWrapper>
            ))}
          </Slider>
        </SliderContainer>

        <Title>{title}</Title>
        <Price>{formatPrice(price)}</Price>
        <Description>{description}</Description>
        <FooterText>
          Postado por <strong>{username}</strong> em {formatDate(createdAt)}
        </FooterText>
      </ContentWrapper>
    </Container>
  );
};

export default PropertyDetails;
