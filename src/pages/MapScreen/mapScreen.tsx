import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Container } from "./styles";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";

const MapScreen: React.FC = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  // Obtendo a localização atual
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    } else {
      console.error("Geolocalização não é suportada neste navegador.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const SetMapView = ({ position }: { position: [number, number] }) => {
    const map = useMap();
    map.setView(position, 13); // Define centro e zoom
    return null;
  };

  if (!position) {
    return <div>Carregando localização...</div>;
  }

  return (
    <Container>
      <Header />
      <div className="map-container">
        <MapContainer style={{ width: "100%", height: "400px" }}>
          <SetMapView position={position} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>Você está aqui!</Popup>
          </Marker>
        </MapContainer>
      </div>
      <Footer />
    </Container>
  );
};

export default MapScreen;
