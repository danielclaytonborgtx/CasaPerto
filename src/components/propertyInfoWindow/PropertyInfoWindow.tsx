import React from "react";
import { OverlayView } from "@react-google-maps/api";
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
  images: { url: string }[];
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

  return (
    <OverlayView
  position={{ lat: property.latitude, lng: property.longitude }}
  mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
>
  <div style={{
    position: "absolute",
    left: "50%",
    top: "0",
    transform: "translate(-50%, -105%)",
  }}>
    <button
      onClick={onClose}
      style={{
        position: "absolute",
        top: 4,
        right: 4,
        background: "white",
        border: "none",
        borderRadius: "50%",
        cursor: "pointer",
        padding: "4px 8px",
        fontWeight: "bold",
        zIndex: 1,
      }}
    >
      ×
    </button>

    <InfoWindowContainer>
      <PropertyImage
        src={property.images?.[0]?.url || "/placeholder.jpg"}
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
  </div>
</OverlayView>

  );
};

export default PropertyInfoWindow;
