// src/components/PropertyInfoWindow.tsx
import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import { FaMapMarkedAlt } from "react-icons/fa";
import {
  InfoContent,
  InfoWindowContainer,
  NavigationIconContainer,
  PropertyImage,
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
    <InfoWindow
      position={{ lat: property.latitude, lng: property.longitude }}
      onCloseClick={onClose}
    >
      <InfoWindowContainer>
        <NavigationIconContainer>
          <FaMapMarkedAlt
            size={25}
            onClick={() =>
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`,
                "_blank"
              )
            }
          />
        </NavigationIconContainer>
        <InfoContent>
          <h3>{property.title}</h3>
          <p>{formatPrice(property.price)}</p>
          <PropertyImage
            src={property.images?.[0]?.url || "/placeholder.jpg"}
            onClick={() => onImageClick(property.id)}
          />
        </InfoContent>
      </InfoWindowContainer>
    </InfoWindow>
  );
};

export default PropertyInfoWindow;
