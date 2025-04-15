import React, { useState, useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";
import LoadingMessage from "./loadingMessage/LoadingMessage";

// Importa o tipo Library diretamente da biblioteca
import type { Libraries } from "@react-google-maps/api";

interface GoogleMapsApiLoaderProps {
  children: React.ReactNode;
  libraries?: Libraries; // Usa o tipo correto aqui
}

// Define as bibliotecas padrão como constante com o tipo correto
const DEFAULT_LIBRARIES: Libraries = ["places"];

const GoogleMapsApiLoader: React.FC<GoogleMapsApiLoaderProps> = ({ 
  children, 
  libraries = DEFAULT_LIBRARIES 
}) => {
  const [isApiLoaded, setIsApiLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (window.google?.maps) {
      setIsApiLoaded(true);
      return;
    }

    const timer = setTimeout(() => {
      if (!isApiLoaded) {
        setLoadError("O carregamento do mapa está demorando mais que o esperado...");
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isApiLoaded]);

  if (loadError) {
    return (
      <div className="error-message">
        {loadError}
        <button onClick={() => window.location.reload()}>Tentar novamente</button>
      </div>
    );
  }

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onLoad={() => setIsApiLoaded(true)}
      onError={() => setLoadError("Falha ao carregar o Google Maps")}
      libraries={libraries}
      loadingElement={<LoadingMessage />}
      language="pt-BR"
      region="BR"
      version="weekly"
    >
      {isApiLoaded ? children : <LoadingMessage />}
    </LoadScript>
  );
};

export default React.memo(GoogleMapsApiLoader);