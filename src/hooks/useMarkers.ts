import { useEffect, useRef } from 'react';
import { Property } from '../types/property';

interface UseMarkersProps {
  map: google.maps.Map | null;
  location: google.maps.LatLngLiteral | null;
  properties: Property[];
  setSelectedProperty: (property: Property | null) => void;
}

export const useMarkers = ({ map, location, properties, setSelectedProperty }: UseMarkersProps) => {
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    if (!map || !location) return;

    // Limpar marcadores existentes e listeners
    markersRef.current.forEach((m) => {
      google.maps.event.clearInstanceListeners(m);
      m.setMap(null);
    });
    markersRef.current = [];

    const newMarkers: google.maps.Marker[] = [];

    // Criar marcadores para as propriedades
    properties.forEach((p) => {
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
        }
      });

      marker.addListener('click', () => {
        setSelectedProperty(p);
        map.panTo({ lat: p.latitude, lng: p.longitude });
        map.setZoom(15);
      });

      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;

    // Adicionar marcador para a localização atual
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
      clickable: false
    });

    // Limpar listeners quando o componente for desmontado
    return () => {
      markersRef.current.forEach((m) => {
        google.maps.event.clearInstanceListeners(m);
        m.setMap(null);
      });
    };
  }, [map, location, properties, setSelectedProperty]);

  return markersRef;
}; 