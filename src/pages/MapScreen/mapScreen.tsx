import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, InfoWindow } from "@react-google-maps/api";
import { FaCrosshairs, FaMapMarkedAlt } from "react-icons/fa";
import {
  Container,
  InfoContent,
  InfoWindowContainer,
  NavigationIconContainer,
  PropertyImage,
  UpdateButton,
  ErrorMessage,
} from "./styles";
import { usePropertyContext } from "../../contexts/PropertyContext";
import { useAuth } from "../../services/authContext";

// Defina as interfaces corretamente
interface Team {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  team?: Team; // Adicione a propriedade team
  teamMemberships?: { teamId: number; team: Team }[]; // Adicione a propriedade teamMemberships
}

interface Property {
  id: number;
  title: string;
  price: string;
  latitude: number;
  longitude: number;
  category: string;
  images: { url: string }[];
  userId: number;
  user: User; // Adicione a propriedade user
}

const MapScreen: React.FC = () => {
  const { user } = useAuth() as { user: User }; // Forçar o tipo User
  const { isRent } = usePropertyContext();
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carrega a localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Erro ao obter localização: ", error);
          setLocation({ lat: -22.9068, lng: -43.1729 }); // Fallback para uma localização padrão
        }
      );
    }
  }, []);

  // Carrega as propriedades do backend
  const loadProperties = useCallback(async () => {
    try {
      if (!user) {
        console.log("Usuário não encontrado.");
        setError("Usuário não encontrado.");
        setIsLoaded(true);
        return;
      }

      // Verifica se o usuário tem um teamId
      const teamId = user?.team?.id;

      // Monta os parâmetros da requisição
      const queryParams = new URLSearchParams({
        userId: user.id.toString(),
        ...(teamId && { teamId: teamId.toString() }), // Adiciona teamId apenas se estiver definido
      });
      console.log("Parâmetros da requisição:", queryParams.toString());

      const response = await fetch(
        `https://servercasaperto.onrender.com/properties/filter?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar as propriedades");
      }

      const data = await response.json();
      console.log("Propriedades retornadas pelo backend:", data); // Depuração
      setProperties(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error);
      setError("Falha ao carregar propriedades.");
      setIsLoaded(true);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log("Usuário atualizado:", user); // Depuração
      loadProperties();
    }
  }, [user, loadProperties]); // Agora `user` está incluído corretamente
  

  // Filtra as propriedades com base na categoria (venda ou aluguel)
  const filteredProperties = useMemo(() => {
    const category = isRent ? "venda" : "aluguel";
  
    if (!user) return [];
  
    // Aplica o filtro e armazena o resultado em uma variável temporária
    const filtered = properties.filter(
      (property) =>
        (property.userId === user.id || // Propriedades do usuário
          (user.team && property.user?.teamMemberships?.some(
            (membership: { teamId: number; team: Team }) => membership.teamId === user.team?.id
          ))) && // Propriedades da equipe (se o usuário tiver uma equipe)
        property.category.toLowerCase() === category.toLowerCase()
    );
  
    // Exibe as propriedades filtradas no console
    console.log("Propriedades filtradas:", filtered);
  
    // Retorna as propriedades filtradas
    return filtered;
  }, [properties, isRent, user]);

  // Define o centro do mapa
  const mapCenter = useMemo(() => {
    return location || { lat: -22.9068, lng: -43.1729 };
  }, [location]);

  // Adiciona marcadores ao mapa
  useEffect(() => {
    if (map && location) {
      // Limpa marcadores anteriores
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

      // Adiciona novos marcadores para as propriedades filtradas
      const newMarkers: google.maps.Marker[] = [];
      filteredProperties.forEach((property) => {
        const propertyMarker = new google.maps.Marker({
          position: { lat: property.latitude, lng: property.longitude },
          map,
          title: property.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#0000ff",
            fillOpacity: 1,
            strokeColor: "#1E90FF",
            strokeWeight: 2,
            scale: 10,
          },
        });

        newMarkers.push(propertyMarker);

        propertyMarker.addListener("click", () => {
          setSelectedProperty(property);
          map.panTo({ lat: property.latitude, lng: property.longitude });
          map.setZoom(15);
        });
      });

      markersRef.current = newMarkers;

      // Adiciona um marcador para a localização do usuário
      new google.maps.Marker({
        position: location,
        map,
        title: "Sua Localização",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#007bff",
          fillOpacity: 1,
          strokeColor: "#E0FFFF",
          strokeWeight: 2,
          scale: 7,
        },
        clickable: false,
      });

      // Limpa os marcadores ao desmontar o componente
      return () => {
        newMarkers.forEach((marker) => marker.setMap(null));
      };
    }
  }, [map, location, filteredProperties]);

  // Seleciona uma propriedade com base no estado da rota
  useEffect(() => {
    if (state && state.id) {
      const propertyToSelect = properties.find((property) => property.id === state.id);
      if (propertyToSelect) {
        setSelectedProperty(propertyToSelect);
        if (map) {
          map.panTo({ lat: propertyToSelect.latitude, lng: propertyToSelect.longitude });
          map.setZoom(15);
        }
      }
    }
  }, [state, properties, map]);

  // Fecha a janela de informações
  const handleCloseInfoWindow = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  // Atualiza a localização do usuário
  const handleUpdateLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          if (map) {
            map.panTo({ lat: latitude, lng: longitude });
            map.setZoom(14);
          }
        },
        (error) => {
          console.error("Erro ao atualizar localização: ", error);
        }
      );
    }
  }, [map]);

  // Formata o preço para o formato BRL
  const formatPrice = (price: string | number) => {
    const priceString = typeof price === "string" ? price : String(price);
    const priceNumber = parseFloat(priceString.replace("R$ ", "").replace(".", "").replace(",", "."));
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceNumber);
  };

  // Navega para a página de detalhes da propriedade
  const handleImageClick = useCallback((propertyId: number) => {
    const property = properties.find((p) => p.id === propertyId);
    if (property) {
      navigate(`/property/${propertyId}`, { state: property });
    }
  }, [properties, navigate]);

  if (!location) {
    return <div>Carregando mapa...</div>;
  }

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          center={mapCenter}
          zoom={13}
          options={{
            disableDefaultUI: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            gestureHandling: "greedy",
            styles: [
              {
                featureType: "poi",
                elementType: "all",
                stylers: [
                  {
                    visibility: "off",
                  },
                ],
              },
            ],
          }}
          onLoad={(mapInstance) => setMap(mapInstance)}
        >
          {selectedProperty && (
            <InfoWindow
              position={{
                lat: selectedProperty.latitude,
                lng: selectedProperty.longitude,
              }}
              onCloseClick={handleCloseInfoWindow}
            >
              <InfoWindowContainer>
                <NavigationIconContainer>
                  <FaMapMarkedAlt
                    size={25}
                    onClick={() => {
                      const destination = `${selectedProperty.latitude},${selectedProperty.longitude}`;
                      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
                      window.open(googleMapsUrl, "_blank");
                    }}
                  />
                </NavigationIconContainer>

                <InfoContent>
                  <h3>{selectedProperty.title}</h3>
                  <p>{formatPrice(selectedProperty.price)}</p>
                  <PropertyImage
                    src={selectedProperty.images?.[0]?.url ? `https://servercasaperto.onrender.com${selectedProperty.images[0].url}` : "caminho/para/imagem/padrao.jpg"}      
                    onClick={() => handleImageClick(selectedProperty.id)}
                  />
                </InfoContent>

              </InfoWindowContainer>
            </InfoWindow>
          )}
        </GoogleMap>
      ) : (
        <div>Carregando mapa...</div>
      )}

      <UpdateButton onClick={handleUpdateLocation}>
        <FaCrosshairs size={20} />
      </UpdateButton>
    </Container>
  );
};

export default MapScreen;