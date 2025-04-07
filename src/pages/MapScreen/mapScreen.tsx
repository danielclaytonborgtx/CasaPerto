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

// Tipagens
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
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [teamMembers, setTeamMembers] = useState<number[]>([]);
  const { isRent } = usePropertyContext();
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setLocation({ lat: coords.latitude, lng: coords.longitude }),
      () => setLocation({ lat: -16.679738, lng: -49.256688 }) // fallback
    );
  }, []);

  useEffect(() => {
    if (!authUser) return;
    const fetchUser = async () => {
      const res = await api.get(`/users/${authUser.id}`);
      setUser({
        id: res.data.id,
        name: res.data.name,
        teamMember: res.data.teamMembers,
      });
    };
    fetchUser();
  }, [authUser]);

  const loadTeamMembers = useCallback(async () => {
    if (!user?.teamMember?.length) return setTeamMembers([]);
    try {
      const teamId = user.teamMember[0].teamId;
      const res = await fetch(`https://servercasaperto.onrender.com/team/${teamId}`);
      const data = await res.json();
      setTeamMembers(data.members.map((m: { userId: number }) => m.userId));
    } catch (err) {
      console.error("Erro ao carregar membros da equipe", err);
      setError("Erro ao carregar membros da equipe");
    }
  }, [user]);

  const loadProperties = useCallback(async () => {
    if (!user) return;
    try {
      const teamId = user.teamMember[0]?.teamId;
      const queryParams = new URLSearchParams({
        userId: user.id.toString(),
        ...(teamId && { teamId: teamId.toString() }),
      });
      const res = await fetch(
        `https://servercasaperto.onrender.com/properties/filter?${queryParams}`
      );
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProperties(data);
    } catch (err) {
      console.error("Erro ao carregar propriedades", err);
      setError("Erro ao carregar propriedades");
    } finally {
      setIsLoaded(true);
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
    return properties.filter((p) => {
      const isFromUser = p.userId === user.id;
      const isFromTeam = teamMembers.includes(p.userId);
      return (isFromUser || isFromTeam) && p.category === category;
    });
  }, [properties, user, teamMembers, isRent]);

  useEffect(() => {
    if (!map || !location) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const newMarkers: google.maps.Marker[] = [];

    filteredProperties.forEach((p) => {
      const marker = new google.maps.Marker({
        position: { lat: p.latitude, lng: p.longitude },
        map,
        title: p.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#0000ff",
          fillOpacity: 1,
          strokeColor: "#1E90FF",
          strokeWeight: 2,
          scale: 10,
        },
      });

      marker.addListener("click", () => {
        setSelectedProperty(p);
        map.panTo({ lat: p.latitude, lng: p.longitude });
        map.setZoom(15);
      });

      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;

    new google.maps.Marker({
      position: location,
      map,
      title: "Sua localização",
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
  }, [map, location, filteredProperties]);

  useEffect(() => {
    if (state?.id && map) {
      const prop = properties.find((p) => p.id === state.id);
      if (prop) {
        setSelectedProperty(prop);
        map.panTo({ lat: prop.latitude, lng: prop.longitude });
        map.setZoom(15);
      }
    }
  }, [state, properties, map]);

  const handleUpdateLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const newLoc = { lat: coords.latitude, lng: coords.longitude };
        setLocation(newLoc);
        if (map) {
          map.panTo(newLoc);
          map.setZoom(14);
        }
      },
      (err) => console.error("Erro ao atualizar localização", err)
    );
  }, [map]);

  // Formata preço
  const formatPrice = (price: string | number) => {
    const num = parseFloat(
      String(price).replace("R$ ", "").replace(".", "").replace(",", ".")
    );
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(num);
  };

  const handleImageClick = useCallback(
    (id: number) => {
      const property = properties.find((p) => p.id === id);
      if (property) navigate(`/property/${id}`, { state: property });
    },
    [properties, navigate]
  );

  if (!location) return <div>Carregando mapa...</div>;

  return (
    <Container>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={location}
          zoom={13}
          onLoad={setMap}
          options={{
            disableDefaultUI: true,
            gestureHandling: "greedy",
            styles: [{ featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] }],
          }}
        >
          {selectedProperty && (
            <InfoWindow
              position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <InfoWindowContainer>
                <NavigationIconContainer>
                  <FaMapMarkedAlt
                    size={25}
                    onClick={() =>
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${selectedProperty.latitude},${selectedProperty.longitude}`,
                        "_blank"
                      )
                    }
                  />
                </NavigationIconContainer>
                <InfoContent>
                  <h3>{selectedProperty.title}</h3>
                  <p>{formatPrice(selectedProperty.price)}</p>
                  <PropertyImage
                    src={selectedProperty.images?.[0]?.url || "/placeholder.jpg"}
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
