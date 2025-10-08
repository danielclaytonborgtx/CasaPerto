import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom"; 
import Slider from "react-slick";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Modal from "react-modal";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import { Property } from "../../types/property";
import { Building2, FileText, Mail } from "lucide-react";
import {
  Container,
  ContentWrapper,
  SliderContainer,
  ImageWrapper,
  Image,
  PropertyHeader,
  Title,
  Price,
  Description,
  DescriptionTitle,
  DescriptionText,
  FooterSection,
  FooterText,
  ContactButton,
  ImageCounter,
} from "./styles";

interface PropertyImage {
  url: string;
}

Modal.setAppElement("#root");

const PropertyDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
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
            setProperty({
              ...data,
              price: data.price, // Manter como string conforme o tipo Property
              user: data.user || { id: 0, name: 'Usuário', teamMember: [] }
            });
          } else {
            console.error("Imóvel não encontrado");
          }
        } catch (error) {
          console.error("Erro ao carregar imóvel:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setProperty(location.state as Property);
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

  const { title, price, description, images = [], user, created_at } = property;

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

  const formatPrice = (price: string | number) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(numericPrice);
  };

  const formatDate = (date: string) => {
    try {
      // Verificar se a data é válida
      if (!date || date === 'null' || date === 'undefined') {
        return "Data não disponível";
      }
      
      // Tentar parsear a data
      const parsedDate = parseISO(date);
      
      // Verificar se a data parseada é válida
      if (isNaN(parsedDate.getTime())) {
        return "Data inválida";
      }
      
      return format(parsedDate, "dd MMMM yyyy", { locale: ptBR });
    } catch (error) {
      console.error("Erro ao formatar data:", error, "Data recebida:", date);
      return "Data inválida";
    }
  };

  const username = user?.name || "Usuário desconhecido";

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
                <ImageCounter>
                  {index + 1} / {images.length}
                </ImageCounter>
              </ImageWrapper>
            ))}
          </Slider>
        </SliderContainer>
        
        <PropertyHeader>
          <Title>{title}</Title>
          <Price>
            {formatPrice(price)}
          </Price>
          
         
        </PropertyHeader>

        <Description>
          <DescriptionTitle>
            <FileText size={18} />
            Descrição do Imóvel
          </DescriptionTitle>
          <DescriptionText>{description}</DescriptionText>
        </Description>

        <FooterSection>
          <FooterText>
            <Building2 size={16} />
            <span>
              Responsável <strong>{username}</strong> em {formatDate(created_at || '')}
            </span>
          </FooterText>
          <ContactButton onClick={() => navigate(`/contact/${property.user_id}`)}>
            <Mail size={16} />
            <span>Entrar em Contato</span>
          </ContactButton>
        </FooterSection>
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
