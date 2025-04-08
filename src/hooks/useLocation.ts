import { useState, useEffect, useCallback } from 'react';

export const useLocation = () => {
  const [location, setLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Obter localização inicial
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setLocation({ lat: coords.latitude, lng: coords.longitude }),
      () => {
        // Fallback para uma localização padrão em caso de erro
        setLocation({ lat: -16.679738, lng: -49.256688 });
        setError("Não foi possível obter sua localização. Usando localização padrão.");
      }
    );
  }, []);

  // Atualizar localização
  const updateLocation = useCallback((map: google.maps.Map | null) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const newLoc = { lat: coords.latitude, lng: coords.longitude };
        setLocation(newLoc);
        if (map) {
          map.panTo(newLoc);
          map.setZoom(14);
        }
      },
      (err) => {
        console.error("Erro ao atualizar localização", err);
        setError("Erro ao atualizar localização");
      }
    );
  }, []);

  return { location, error, updateLocation };
}; 