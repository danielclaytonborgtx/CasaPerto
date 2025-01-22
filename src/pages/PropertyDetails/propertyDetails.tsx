import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom"; 
import Slider from "react-slick";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Modal from "react-modal";
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
  MapLink, 
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
  latitude: number;
  longitude: number;
}

Modal.setAppElement("#root");

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetailsProps | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProperty = async () => {
      if (!location.state) {
        try {
          const response = await fetch(
            `https://server-2-production.up.railway.app/property/${id}`
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

  const resolveImageUrl = (img: PropertyImage | string) => {
    if (typeof img === "string") {
      return `https://server-2-production.up.railway.app${img}`;
    } else if (img.url) {
      return `https://server-2-production.up.railway.app${img.url}`;
    }
    return "";
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);

    document.body.classList.add("modal-open");
  };

  const closeModal = () => {
    setIsModalOpen(false);

    document.body.classList.remove("modal-open");
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNavigateToMap = () => {
    navigate("/map", { state: { property } }); 
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
                  onClick={() => handleImageClick(index)}
                  onError={(e) => {
                    e.currentTarget.src = "/fallback-image.jpg";
                  }}
                />
              </ImageWrapper>
            ))}
          </Slider>
        </SliderContainer>
        <Price>{formatPrice(price)}</Price>
        <Description>{description}</Description>
        
        <MapLink onClick={handleNavigateToMap}>Ver no mapa</MapLink>

        <FooterText>
          Postado por <strong>{username}</strong> em {formatDate(createdAt)}
        </FooterText>
      </ContentWrapper>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Imagem em tela cheia"
        style={{
          content: {
            inset: "0",
            background: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "none", 
            padding: "0",
            margin: "0",
          },
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.9)",
            zIndex: 9999,
          },
        }}
      >
        <button
          onClick={closeModal}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            fontSize: "24px",
            color: "white",
            cursor: "pointer",
            zIndex: 10000,
          }}
        >
          ✕
        </button>
        <button
          onClick={prevImage}
          style={{
            position: "absolute",
            left: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            fontSize: "32px",
            color: "white",
            cursor: "pointer",
            zIndex: 10000,
          }}
        >
          ‹
        </button>
        <img
          src={resolveImageUrl(images[currentImageIndex])}
          alt={`Imagem ${currentImageIndex + 1}`}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
        <button
          onClick={nextImage}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "transparent",
            border: "none",
            fontSize: "32px",
            color: "white",
            cursor: "pointer",
            zIndex: 10000,
          }}
        >
          ›
        </button>
      </Modal>
    </Container>
  );
};

export default PropertyDetails;
