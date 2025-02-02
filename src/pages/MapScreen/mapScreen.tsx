import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleMap, InfoWindow } from "@react-google-maps/api";
import { FaCrosshairs, FaMapMarkedAlt } from "react-icons/fa";
import { Container, InfoContent, InfoWindowContainer, NavigationIconContainer, PropertyImage, UpdateButton } from "./styles";
import { usePropertyContext } from "../../contexts/PropertyContext";

interface Property {
  id: number;
  title: string;
  price: string;
  latitude: number;
  longitude: number;
  category: string;
  images: { url: string }[];
}

const MapScreen: React.FC = () => {
  const { isRent } = usePropertyContext();
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Erro ao obter localização: ", error);
          setLocation({ lat: -22.9068, lng: -43.1729 }); 
        }
      );
    }

    const loadProperties = async () => {
      try {
        const response = await fetch("https://server-2-production.up.railway.app/property");
        if (!response.ok) {
          throw new Error("Erro ao buscar as propriedades");
        }
        const data = await response.json();
        setProperties(data);
        setIsLoaded(true);
      } catch (error) {
        console.error("Erro ao carregar propriedades:", error);
        setIsLoaded(true);
      }
    };

    loadProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    const category = isRent ? "venda" : "aluguel";
    return properties.filter((property) => property.category.toLowerCase() === category.toLowerCase());
  }, [properties, isRent]);

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

      return () => {
        newMarkers.forEach((marker) => marker.setMap(null));
      };
    }
  }, [map, location, filteredProperties]);

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
    const priceNumber = parseFloat(priceString.replace("R$ ", "").replace(".", "").replace(",", "."));
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(priceNumber);
  };

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
                    src={`https://server-2-production.up.railway.app${selectedProperty.images?.[0]}`}
                    alt={selectedProperty.title}
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
