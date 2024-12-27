import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Container, UpdateButton } from "./styles";

interface Property {
  id: number;
  titulo: string;
  latitude: number;
  longitude: number;
  images: { url: string }[];
}

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null); // Adicionando o estado do mapa

  useEffect(() => {
    // Obter localização atual do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Erro ao obter localização: ", error);
          setLocation({ lat: -22.9068, lng: -43.1729 }); // Localização padrão (Rio de Janeiro)
        }
      );
    } else {
      console.error("Geolocalização não é suportada pelo navegador.");
    }

    // Fetch das propriedades da API
    fetch("http://localhost:3333/property")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar as propriedades");
        }
        return response.json();
      })
      .then((data) => {
        setProperties(data); // Atualiza as propriedades com os dados da API
      })
      .catch((error) => {
        console.error("Erro ao carregar propriedades:", error);
      });
  }, []);

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleCloseInfoWindow = () => {
    setSelectedProperty(null);
  };

  const handleUpdateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          if (map) {
            // Atualiza o centro e o zoom do mapa após obter a nova localização
            map.panTo({ lat: latitude, lng: longitude }); // Centraliza o mapa na nova localização
            map.setZoom(14); // Reseta o zoom para 14
          }
        },
        (error) => {
          console.error("Erro ao atualizar localização: ", error);
        }
      );
    }
  };

  // Se a localização ainda não foi obtida, renderiza um carregamento
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
            fullscreenControl: true,
          }}
          onLoad={(mapInstance) => setMap(mapInstance)} // Armazena o mapa após a carga
        >
          {/* Marcador do usuário */}
          <Marker position={location} />

          {/* Marcadores das propriedades */}
          {properties.map((property) => (
            <Marker
              key={property.id}
              position={{ lat: property.latitude, lng: property.longitude }}
              onClick={() => handleMarkerClick(property)}
            />
          ))}

          {/* Janela de informações */}
          {selectedProperty && (
            <InfoWindow
              position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
              onCloseClick={handleCloseInfoWindow}
            >
              <div>
                <h3>{selectedProperty.titulo}</h3>
                <img
                  src={selectedProperty.images[0]?.url || "/placeholder.jpg"}
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                />
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>

      {/* Botão para atualizar localização */}
      <UpdateButton onClick={handleUpdateLocation}>
        Atualizar Localização
      </UpdateButton>
    </Container>
  );
};

export default MapComponent;
