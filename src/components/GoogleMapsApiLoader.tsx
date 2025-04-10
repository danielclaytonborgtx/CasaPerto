import React, { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";

interface GoogleMapsApiLoaderProps {
  children: React.ReactNode;
}

const GoogleMapsApiLoader: React.FC<GoogleMapsApiLoaderProps> = ({ children }) => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  useEffect(() => {
    if (window.google) {
      setIsApiLoaded(true);
    }
  }, []);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={() => setIsApiLoaded(true)}
      libraries={["places", "geometry"]}
      loadingElement={<div>Carregando API do Google Maps...</div>}
      mapIds={["YOUR_MAP_ID"]} // Adicione seu Map ID aqui se estiver usando um
    >
      {isApiLoaded ? children : <div>Carregando API do Google Maps...</div>}
    </LoadScript>
  );
};

export default GoogleMapsApiLoader;
