import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import { FaCrosshairs } from "react-icons/fa";

import {
  Container,
  UpdateButton,
  ErrorMessage,
  LoginMessage,
} from "./styles";

import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import { usePropertyContext } from "../../contexts/PropertyContext";
import MapWithMarkers from "../../components/mapWithMarkers/MapWithMarkers";
import { usePropertyData } from "../../hooks/usePropertyData";
import { useLocation } from "../../hooks/useLocation";
import { useMarkers } from "../../hooks/useMarkers";
import { Property } from "../../types/property";
import { useAuth } from "../../services/authContext";

const MapScreen: React.FC = () => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [initiallySelectedProperty, setInitiallySelectedProperty] = useState<Property | null>(null);
  
  const { isRent } = usePropertyContext();
  const { properties, error: dataError, isLoaded } = usePropertyData(isRent);
  const { location, error: locationError, updateLocation } = useLocation();
  const navigate = useNavigate();
  const { state } = useRouterLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (state?.id && properties.length > 0) {
      const prop = properties.find((p) => p.id === state.id);
      if (prop) {
        setInitiallySelectedProperty(prop);
        navigate('.', { replace: true, state: {} });
      }
    }
  }, [state, properties, navigate]);

  useEffect(() => {
    if (map && initiallySelectedProperty) {
      map.panTo({ lat: initiallySelectedProperty.latitude, lng: initiallySelectedProperty.longitude });
      map.setZoom(15);
      setSelectedProperty(initiallySelectedProperty);
      setInitiallySelectedProperty(null);
    }
  }, [map, initiallySelectedProperty]);

  useMarkers({ 
    map, 
    location, 
    properties, 
    setSelectedProperty,
  });

  const handleImageClick = useCallback(
    (id: number) => {
      const property = properties.find((p) => p.id === id);
      if (property) navigate(`/property/${id}`, { state: property });
    },
    [properties, navigate]
  );

  const handleUpdateLocation = useCallback(() => {
    updateLocation(map);
  }, [map, updateLocation]);

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  if (!location) return <LoadingMessage />;

  if (!user) {
    return (
      <Container>
        <LoginMessage>
          Para ter acesso as localizações e mais detalhes do perfil, você precisa estar logado.
        </LoginMessage>
      </Container>
    );
  }

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
          onCloseInfoWindow={handleCloseInfoWindow}
          handleImageClick={handleImageClick}
          onMapLoad={setMap}
        />
      ) : (
        <LoadingMessage />
      )}
      <UpdateButton onClick={handleUpdateLocation}>
        <FaCrosshairs size={20} />
      </UpdateButton>
    </Container>
  );
};

export default MapScreen;