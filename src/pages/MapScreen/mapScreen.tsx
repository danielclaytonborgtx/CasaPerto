import React, { useState, useCallback } from "react";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import { FaCrosshairs } from "react-icons/fa";

import {
  Container,
  UpdateButton,
  ErrorMessage,
  LoadingMessage,
} from "./styles";

import { usePropertyContext } from "../../contexts/PropertyContext";
import MapWithMarkers from "../../components/mapWithMarkers/MapWithMarkers";
import { usePropertyData } from "../../hooks/usePropertyData";
import { useLocation } from "../../hooks/useLocation";
import { useMarkers } from "../../hooks/useMarkers";
import { Property } from "../../types/property";

const MapScreen: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const { isRent } = usePropertyContext();
  const { properties, error: dataError, isLoaded } = usePropertyData(isRent);
  const { location, error: locationError, updateLocation } = useLocation();
  const navigate = useNavigate();
  const { state } = useRouterLocation();

  // Usar o hook de marcadores
  useMarkers({ map, location, properties, setSelectedProperty });

  // Navegar para a página de detalhes da propriedade
  const handleImageClick = useCallback(
    (id: number) => {
      const property = properties.find((p) => p.id === id);
      if (property) navigate(`/property/${id}`, { state: property });
    },
    [properties, navigate]
  );

  // Atualizar localização
  const handleUpdateLocation = useCallback(() => {
    updateLocation(map);
  }, [map, updateLocation]);

  // Selecionar propriedade quando navegando de outra página
  React.useEffect(() => {
    if (state?.id && map) {
      const prop = properties.find((p) => p.id === state.id);
      if (prop) {
        setSelectedProperty(prop);
        map.panTo({ lat: prop.latitude, lng: prop.longitude });
        map.setZoom(15);
      }
    }
  }, [state, properties, map]);

  if (!location) return <LoadingMessage>Carregando mapa...</LoadingMessage>;

  return (
    <Container>
      {(dataError || locationError) && (
        <ErrorMessage>{dataError || locationError}</ErrorMessage>
      )}
      {isLoaded ? (
        <MapWithMarkers
          location={location}
          properties={properties}
          selectedProperty={selectedProperty}
          setSelectedProperty={setSelectedProperty}
          handleImageClick={handleImageClick}
          onMapLoad={setMap}
        />
      ) : (
        <LoadingMessage>Carregando mapa...</LoadingMessage>
      )}
      <UpdateButton onClick={handleUpdateLocation}>
        <FaCrosshairs size={20} />
      </UpdateButton>
    </Container>
  );
};

export default MapScreen;
