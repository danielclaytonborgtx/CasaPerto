import { useEffect, useRef, useMemo } from 'react';
import { Property } from '../types/property';

interface UseMarkersProps {
  map: google.maps.Map | null;
  location: google.maps.LatLngLiteral | null;
  properties: Property[];
  setSelectedProperty: (property: Property | null) => void;
}

export const useMarkers = ({ map, location, properties, setSelectedProperty }: UseMarkersProps) => {
  const markersRef = useRef<google.maps.Marker[]>([]);
  const currentLocationMarkerRef = useRef<google.maps.Marker | null>(null);

  // Memoize as propriedades para evitar recriações desnecessárias
  const memoizedProperties = useMemo(() => properties, [properties]);

  useEffect(() => {
    if (!map || !location) return;

    // Limpar marcadores existentes e listeners
    markersRef.current.forEach((m) => {
      google.maps.event.clearInstanceListeners(m);
      m.setMap(null);
    });
    markersRef.current = [];

    // Limpar marcador de localização atual
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.setMap(null);
      currentLocationMarkerRef.current = null;
    }

    const newMarkers: google.maps.Marker[] = [];

    // Criar marcadores para as propriedades com otimização
    memoizedProperties.forEach((p) => {
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
        optimized: true // Habilita otimização de renderização
      });

      marker.addListener('click', () => {
        setSelectedProperty(p);
        map.panTo({ lat: p.latitude, lng: p.longitude });
        map.setZoom(15);
      });

      newMarkers.push(marker);
    });

    markersRef.current = newMarkers;

    // Adicionar marcador para a localização atual com otimização
    currentLocationMarkerRef.current = new google.maps.Marker({
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
      optimized: true
    });

    // Limpar listeners quando o componente for desmontado
    return () => {
      markersRef.current.forEach((m) => {
        google.maps.event.clearInstanceListeners(m);
        m.setMap(null);
      });
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.setMap(null);
      }
    };
  }, [map, location, memoizedProperties, setSelectedProperty]);

  return markersRef;
}; 