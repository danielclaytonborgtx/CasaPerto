import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom"; 
import Slider from "react-slick";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Modal from "react-modal";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
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
  id: number;
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

  useEffect(() => {
    const fetchProperty = async () => {
      if (!location.state) {
        try {
          const { supabaseProperties } = await import('../../services/supabaseProperties');
          const data = await supabaseProperties.getPropertyById(Number(id));
          if (data) {
            setProperty(data);
          } else {
            console.error("Imóvel não encontrado");
          }
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
    return <LoadingMessage />;
  }

  if (!property) {
    return <p>Erro: Nenhuma propriedade foi encontrada.</p>;
  }

  const { title, price, description, images = [], user, createdAt } = property;

  const settings = {
    dots: true,
    infinite: images.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: true,
    initialSlide: currentImageIndex,
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
      if (img.startsWith("http")) {
        return img;  
      }
      return img; // Imagem já está no formato correto do Supabase  
    } else if (img && typeof img === "object" && "url" in img) {
      const imageUrl = img.url;
      if (imageUrl.startsWith("http")) {
        return imageUrl; 
      }
      return imageUrl; // Imagem já está no formato correto do Supabase  
    }
    return "/fallback-image.jpg";  
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

  return (
    <Container>
      <ContentWrapper>
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
        <Title>{title}</Title>
        <Price>{formatPrice(price)}</Price>
        <Description>{description}</Description>

        <FooterText>
          Responsável Creci{" "}
          <strong>{username}</strong> em {formatDate(createdAt)}
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

        <div style={{ width: "100%", maxWidth: "800px" }}>
          <Slider
            {...{
              dots: true,
              infinite: images.length > 1,
              speed: 500,
              slidesToShow: 1,
              slidesToScroll: 1,
              adaptiveHeight: true,
              arrows: true,
              initialSlide: currentImageIndex,
            }}
          >
            {images.map((img, idx) => (
              <div key={idx}>
                <img
                  src={resolveImageUrl(img)}
                  alt={`Imagem ${idx + 1}`}
                  style={{
                    width: "100%",
                    height: "80vh",
                    objectFit: "contain",
                    margin: "0 auto",
                  }}
                  onError={(e) => {
                    e.currentTarget.src = "/fallback-image.jpg";
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
      </Modal>
    </Container>
  );
};

export default PropertyDetails;
