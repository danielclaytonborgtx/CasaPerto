import React, { useEffect, useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import LoadingMessage from "./loadingMessage/LoadingMessage";

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
      loadingElement={<LoadingMessage />}
    >
      {isApiLoaded ? children : <LoadingMessage />}
    </LoadScript>
  );
};

export default GoogleMapsApiLoader;
