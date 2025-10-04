import React, { useState, useMemo } from "react";
import { LoadScript } from "@react-google-maps/api";
import LoadingMessage from "./loadingMessage/LoadingMessage";

interface GoogleMapsApiLoaderProps {
  children: React.ReactNode;
}

// Definir as libraries como constante fora do componente para evitar recriações
const LIBRARIES: ("places" | "geometry")[] = ["places", "geometry"];

const GoogleMapsApiLoader: React.FC<GoogleMapsApiLoaderProps> = ({ children }) => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={LIBRARIES}
      onLoad={() => setIsApiLoaded(true)}
      loadingElement={<LoadingMessage />}
    >
      {isApiLoaded ? children : null}
    </LoadScript>
  );
};

export default GoogleMapsApiLoader;
