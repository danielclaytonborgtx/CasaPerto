import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  InfoContent,
  InfoWindowContainer,
  PriceContainer,
  PropertyImage,
  Title,
  Price,
} from "./styles";

interface Property {
  id: number;
  title: string;
  price: string;
  latitude: number;
  longitude: number;
  images: string[] | { url: string }[];
}

interface Props {
  property: Property;
  onClose: () => void;
  onImageClick: (id: number) => void;
}

const PropertyInfoWindow: React.FC<Props> = ({
  property,
  onClose,
  onImageClick,
}) => {
  const formatPrice = (price: string | number) => {
    const num = parseFloat(
      String(price).replace("R$ ", "").replace(".", "").replace(",", ".")
    );
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const getImageUrl = (images: string[] | { url: string }[] | undefined) => {
    console.log('🖼️ PropertyInfoWindow: Imagens recebidas', images);
    
    if (!images || images.length === 0) {
      console.log('🖼️ Nenhuma imagem encontrada, usando placeholder');
      return "/placeholder.jpg";
    }
    
    // Se é array de strings
    if (typeof images[0] === 'string') {
      console.log('🖼️ Usando primeira imagem (string):', images[0]);
      return images[0] as string;
    }
    
    // Se é array de objetos com url
    const url = (images[0] as { url: string }).url;
    console.log('🖼️ Usando primeira imagem (objeto):', url);
    return url;
  };

  return (
    <InfoWindow
      position={{ lat: property.latitude, lng: property.longitude }}
      onCloseClick={onClose}
      options={{ disableAutoPan: false, pixelOffset: new window.google.maps.Size(0, -5) }}
    >
      <InfoWindowContainer>
        <PropertyImage
          src={getImageUrl(property.images)}
          onClick={() => onImageClick(property.id)}
        />
        <InfoContent>
          <Title>{property.title}</Title>
          <PriceContainer>
            <Price>{formatPrice(property.price)}</Price>
            <FaMapMarkerAlt
              size={16}
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`,
                  "_blank"
                )
              }
            />
          </PriceContainer>
        </InfoContent>
      </InfoWindowContainer>
    </InfoWindow>
  );
};

export default PropertyInfoWindow;