import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
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
import api from "../../services/api";

interface Team {
  id: number;
  name: string;
}

interface User {
  id: number;
  name: string;
  teamMember: { teamId: number; team: Team }[]; 
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
  user: User; 
  teamId?: number; 
}

const MapScreen: React.FC = () => {
  const [user, setUser] = useState<User>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(
    null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<number[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const { isRent } = usePropertyContext();
  const useContext = useAuth();

  useEffect(() => {
    async function loadUser() {
      if (!useContext.user) return;

      const response = await api.get(`/users/${useContext.user?.id}`);

      setUser({
        id: response.data.id,
        name: response.data.name,
        teamMember: response.data.teamMembers,
      });
    }
    loadUser();
  }, [useContext]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Erro ao obter localização: ", error);
          setLocation({ lat: -16.679738, lng: -49.256688 }); 
        }
      );
    }
  }, []);

  const loadProperties = useCallback(async () => {
    try {
      if (!user) {
        console.log("Usuário não encontrado.");
        setError("Usuário não encontrado.");
        setIsLoaded(true);
        return;
      }

      const teamId = user?.teamMember?.[0]?.teamId;

      const queryParams = new URLSearchParams({
        userId: user.id.toString(),
        ...(teamId && { teamId: teamId.toString() }), 
      });

      const response = await fetch(
        `https://servercasaperto.onrender.com/properties/filter?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar as propriedades");
      }

      const data = await response.json();
      
      setProperties(data);
      setIsLoaded(true);
    } catch (error) {
      console.error("Erro ao carregar propriedades:", error);
      setError("Falha ao carregar propriedades.");
      setIsLoaded(true);
    }
  }, [user]);

  const loadTeamMembers = useCallback(async () => {
   
    if (!user?.teamMember || user.teamMember.length === 0) {
      setTeamMembers([]); 
      return;
    }
  
    try {
      const teamId = user.teamMember[0].teamId;
  
      const response = await fetch(`https://servercasaperto.onrender.com/team/${teamId}`);
      if (!response.ok) {
        throw new Error("Erro ao buscar membros da equipe");
      }
  
      const data = await response.json();
  
      const memberIds = data.members.map(
        (member: { userId: number }) => member.userId
      );
      setTeamMembers(memberIds);
    } catch (error) {
      console.error("Erro ao buscar membros da equipe:", error);
      setError("Falha ao carregar membros da equipe.");
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadProperties();
      loadTeamMembers();
    }
  }, [user, loadProperties, loadTeamMembers]);

  const filteredProperties = useMemo(() => {
    const category = isRent ? "Venda" : "Aluguel";

    if (!user) return [];

    const filtered = properties.filter((property) => {
     
      const isUserProperty = property.userId === user.id;

      const isTeamProperty = teamMembers.includes(property.userId);

      const isCorrectCategory = property.category === category;

      return (isUserProperty || isTeamProperty) && isCorrectCategory;
    });

    return filtered;
  }, [properties, isRent, user, teamMembers]);

  const mapCenter = useMemo(() => {
    return location || { lat: -22.9068, lng: -43.1729 };
  }, [location]);

  useEffect(() => {
    if (map && location) {
      
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];

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
    }
  }, [map, location, filteredProperties]);

  useEffect(() => {
    if (state && state.id) {
      const propertyToSelect = properties.find(
        (property) => property.id === state.id
      );
      if (propertyToSelect) {
        setSelectedProperty(propertyToSelect);
        if (map) {
          map.panTo({
            lat: propertyToSelect.latitude,
            lng: propertyToSelect.longitude,
          });
          map.setZoom(15);
        }
      }
    }
  }, [state, properties, map]);

  const handleCloseInfoWindow = useCallback(() => {
    setSelectedProperty(null);
  }, []);

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

  const formatPrice = (price: string | number) => {
    const priceString = typeof price === "string" ? price : String(price);
    const priceNumber = parseFloat(
      priceString.replace("R$ ", "").replace(".", "").replace(",", ".")
    );
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceNumber);
  };

  const handleImageClick = useCallback(
    (propertyId: number) => {
      const property = properties.find((p) => p.id === propertyId);
      if (property) {
        navigate(`/property/${propertyId}`, { state: property });
      }
    },
    [properties, navigate]
  );

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
                    src={
                      selectedProperty.images?.[0]?.url || "caminho/para/imagem/padrao.jpg"
                    }
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
