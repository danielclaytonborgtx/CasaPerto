import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { FaCrosshairs } from "react-icons/fa";
import { Container, UpdateButton } from "./styles";
import { usePropertyContext } from "../../contexts/PropertyContext";

// Interface de imóveis
interface Property {
  id: number;
  title: string;
  price: string;
  latitude: number;
  longitude: number;
  category: string;
  images: { url: string }[];
}

const MapComponent: React.FC = () => {
  const { isRent } = usePropertyContext(); // Obtém o estado do contexto para alternar entre aluguel e venda
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Erro ao obter localização: ", error);
          setLocation({ lat: -22.9068, lng: -43.1729 }); // Coordenadas padrão caso ocorra erro
        }
      );
    }

    fetch("https://casa-mais-perto-server-clone-production.up.railway.app/property")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar as propriedades");
        }
        return response.json();
      })
      .then((data) => {
        setProperties(data);
      })
      .catch((error) => {
        console.error("Erro ao carregar propriedades:", error);
      });
  }, []);

  // Filtrando propriedades com base na categoria (venda ou aluguel)
  const filteredProperties = properties.filter((property) => {
    const category = isRent ? "venda" : "aluguel";
    return property.category.toLowerCase() === category.toLowerCase();
  });

  useEffect(() => {
    if (map && location) {
      if (!userMarkerRef.current) {
        const userMarker = new google.maps.Marker({
          position: location,
          map,
          title: "Sua Localização",
        });
        userMarkerRef.current = userMarker;
      } else {
        userMarkerRef.current.setPosition(location);
      }

      const currentMarkers: google.maps.Marker[] = [];
      filteredProperties.forEach((property) => {
        const propertyMarker = new google.maps.Marker({
          position: { lat: property.latitude, lng: property.longitude },
          map,
          title: property.title,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#007bff",
            fillOpacity: 1,
            strokeColor: "#007bff",
            strokeWeight: 2,
            scale: 8,
          },
        });

        currentMarkers.push(propertyMarker);

        propertyMarker.addListener("click", () => {
          setSelectedProperty(property); // Abre o InfoWindow
        });
      });

      markersRef.current = currentMarkers;

      return () => {
        currentMarkers.forEach((marker) => marker.setMap(null));
        if (userMarkerRef.current) {
          userMarkerRef.current.setMap(null);
        }
      };
    }
  }, [map, location, filteredProperties]);

  const handleCloseInfoWindow = () => {
    setSelectedProperty(null); // Fecha o InfoWindow
  };

  const handleUpdateLocation = () => {
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
  };

  const formatPrice = (price: string | number) => {
    const priceString = typeof price === 'string' ? price : String(price);
    const priceNumber = parseFloat(priceString.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceNumber);
  };

  const handleImageClick = (propertyId: number) => {
    const property = properties.find(p => p.id === propertyId);
    if (property) {
      navigate(`/property/${propertyId}`, { state: property });
    }
  };

  if (!location) {
    return <div>Carregando mapa...</div>;
  }

  return (
    <Container>
      <LoadScript googleMapsApiKey="AIzaSyDYVtKwXhjWQyyxOgp7qfUHf3sH9fNTins">
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "100%",
          }}
          center={location}
          zoom={14}
          options={{
            disableDefaultUI: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
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
          <Marker position={location} title="Sua Localização" />

          {selectedProperty && (
            <InfoWindow
              position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
              onCloseClick={handleCloseInfoWindow} // Fechar a janela ao clicar no "X"
            >
              <div>
                <h3>{selectedProperty.title}</h3>
                <p>{formatPrice(selectedProperty.price)}</p>
                <img
                  src={`https://casa-mais-perto-server-clone-production.up.railway.app${selectedProperty.images?.[0]}`}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  alt={selectedProperty.title}
                  onClick={() => handleImageClick(selectedProperty.id)} // Navega para a página do imóvel
                />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      <UpdateButton onClick={handleUpdateLocation}>
        <FaCrosshairs size={20} />
      </UpdateButton>
    </Container>
  );
};

export default MapComponent;
