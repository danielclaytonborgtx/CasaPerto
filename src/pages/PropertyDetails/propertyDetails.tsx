import React, { useEffect, useState } from "react";
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

interface PropertyImage {
  url: string;
}

interface PropertyDetailsProps {
  title: string;
  price: number;
  description: string;
  images: PropertyImage[] | string[];
  user?: { username: string };
  createdAt: string;
}

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      console.log("Fetching property with ID:", id);
      if (!location.state) {
        try {
          const response = await fetch(
            `https://server-2-production.up.railway.app/property/${id}`
          );
          console.log("API Response:", response);
          if (!response.ok) {
            throw new Error("Erro ao buscar imóvel");
          }
          const data = await response.json();
          console.log("Property Data:", data);
          setProperty(data);
        } catch (error) {
          console.error("Erro ao carregar imóvel:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("Using location.state for property data:", location.state);
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

  const resolveImageUrl = (img: PropertyImage | string) => {
    if (typeof img === "string") {
      return `https://server-2-production.up.railway.app${img}`;
    } else if (img.url) {
      return `https://server-2-production.up.railway.app${img.url}`;
    }
    return "";
  };

  return (
    <Container>
      <ContentWrapper>
        <Title>{title}</Title>
        <SliderContainer>
          <Slider {...settings}>
            {images.map((img, index) => (
              <ImageWrapper key={index}>
                <Image
                  src={resolveImageUrl(img)}
                  alt={`Imagem do imóvel ${index + 1}`}
                  onError={(e) => {
                    e.currentTarget.src = "/fallback-image.jpg"; // Imagem padrão em caso de erro
                  }}
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
