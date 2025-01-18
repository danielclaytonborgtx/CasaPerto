import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
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
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL
  const [property, setProperty] = useState<PropertyDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca dados do imóvel pela API caso o estado não esteja disponível
  useEffect(() => {
    const fetchProperty = async () => {
      if (!location.state) {
        try {
          const response = await fetch(
            `https://server-2-production.up.railway.app/properties/${id}`
          );
          if (!response.ok) {
            throw new Error("Erro ao buscar imóvel");
          }
          const data = await response.json();
          setProperty(data);
        } catch (error) {
          console.error("Erro ao carregar imóvel:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setProperty(location.state as PropertyDetailsProps);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, location.state]);

  if (loading) {
    return <p>Carregando imóvel...</p>;
  }

  if (!property) {
    return <p>Erro: Nenhuma propriedade foi encontrada.</p>;
  }

  const { title, price, description, images, user, createdAt } = property;

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
        <Title>{title}</Title>
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
