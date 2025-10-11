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
  const [allPropertiesForVisitors, setAllPropertiesForVisitors] = useState<Property[]>([]);
  
  const { isRent } = usePropertyContext();
  const { properties, error: dataError, isLoaded: dataIsLoaded } = usePropertyData(isRent);
  const { location, error: locationError, updateLocation } = useLocation();
  const navigate = useNavigate();
  const { state } = useRouterLocation();
  const { user } = useAuth();

  // Para visitantes, considerar carregado imediatamente após ter localização
  const isLoaded = user ? dataIsLoaded : !!location;

  // Carregar todas as propriedades para visitantes (apenas para contagem)
  useEffect(() => {
    if (!user && location) {
      const loadAllProperties = async () => {
        try {
          const { supabaseProperties } = await import('../../services/supabaseProperties');
          const allProps = await supabaseProperties.getAllProperties();
          setAllPropertiesForVisitors(allProps);
        } catch (err) {
          console.error("Erro ao carregar propriedades para visitantes:", err);
        }
      };
      loadAllProperties();
    }
  }, [user, location]);

  // Função para calcular distância entre dois pontos (fórmula de Haversine)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Calcular quantos imóveis estão em um raio de 100km
  const propertiesInRadius = location ? (user ? properties : allPropertiesForVisitors).filter(property => {
    const distance = calculateDistance(
      location.lat,
      location.lng,
      property.latitude,
      property.longitude
    );
    return distance <= 100;
  }).length : 0;

  // Log para debug
  useEffect(() => {
    console.log('🗺️ MapScreen: Estado atual', {
      propertiesCount: properties.length,
      isLoaded,
      isRent,
      user: user?.id,
      hasTeam: !!user?.teamMembers?.length,
      teamId: user?.teamMembers?.[0]?.teamId,
      properties: properties.map(p => ({ 
        id: p.id, 
        title: p.title, 
        category: p.category,
        user_id: p.userId,
        team_id: p.teamId
      }))
    });
  }, [properties, isLoaded, isRent, user]);

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

  return (
    <Container>
      {(dataError || locationError) && (
        <ErrorMessage>{dataError || locationError}</ErrorMessage>
      )}
      
      {/* Mensagem para visitantes não logados */}
      {!user && isLoaded && (
        <LoginMessage>
          <h2>🏠 Descubra Imóveis Próximos a Você</h2>
          <p className="properties-count">
            Encontramos <strong>{propertiesInRadius} {propertiesInRadius === 1 ? 'imóvel' : 'imóveis'}</strong> disponíveis em um raio de 100km da sua localização!
          </p>
          <p className="info-text">
            Para visualizar os imóveis no mapa, você precisa se cadastrar.
          </p>
          <button 
            className="register-button"
            onClick={() => navigate('/contact')}
          >
            Cadastre-se Agora
          </button>
        </LoginMessage>
      )}
      
      {isLoaded ? (
        <MapWithMarkers
          location={location}
          properties={user ? properties : []} // Visitantes veem mapa vazio
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