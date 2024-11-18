import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Container } from './styles';

const MapComponent: React.FC = () => {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);

  useEffect(() => {
    // Função para obter a localização atual do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Erro ao obter localização: ", error);
          // Defina uma localização padrão caso haja erro
          setLocation({ lat: -22.9068, lng: -43.1729 }); // Rio de Janeiro
        }
      );
    } else {
      console.error("Geolocalização não é suportada pelo navegador.");
    }
  }, []);

  // Se a localização ainda não foi obtida, não renderiza o mapa
  if (!location) {
    return <div>Carregando mapa...</div>;
  }

  return (
    <Container>
      <LoadScript googleMapsApiKey="AIzaSyDYVtKwXhjWQyyxOgp7qfUHf3sH9fNTins">
        <GoogleMap
          mapContainerStyle={{
            width: '100%', // O mapa deve ocupar toda a largura
            height: '100%', // O mapa deve ocupar toda a altura do seu container
          }}
          center={location}
          zoom={14}
        >
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </Container>
  );
};

export default MapComponent;
