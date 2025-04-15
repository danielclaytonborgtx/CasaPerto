import React, { useState } from "react";
import { LoadScript } from "@react-google-maps/api";
import LoadingMessage from "./loadingMessage/LoadingMessage";

interface GoogleMapsApiLoaderProps {
  children: React.ReactNode;
}

const GoogleMapsApiLoader: React.FC<GoogleMapsApiLoaderProps> = ({ children }) => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={["places", "geometry"]}
      onLoad={() => setIsApiLoaded(true)}
      loadingElement={<LoadingMessage />}
    >
      {isApiLoaded ? children : null}
    </LoadScript>
  );
};

export default GoogleMapsApiLoader;
