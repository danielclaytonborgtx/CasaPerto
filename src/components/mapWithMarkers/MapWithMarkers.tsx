// src/components/MapWithMarkers/MapWithMarkers.tsx
import React, { useRef } from "react";
import { GoogleMap } from "@react-google-maps/api";
import PropertyInfoWindow from "../propertyInfoWindow/PropertyInfoWindow";
import { Property } from "../../types/property";
import { useMarkers } from "../../hooks/useMarkers";

interface MapWithMarkersProps {
  location: google.maps.LatLngLiteral;
  properties: Property[];
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  handleImageClick: (id: number) => void;
  onMapLoad: (map: google.maps.Map) => void;
}

const MapWithMarkers: React.FC<MapWithMarkersProps> = ({
  location,
  properties,
  selectedProperty,
  setSelectedProperty,
  handleImageClick,
  onMapLoad,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    onMapLoad(map);
  };

  // Usar o hook useMarkers para gerenciar os marcadores
  useMarkers({
    map: mapRef.current,
    location,
    properties,
    setSelectedProperty,
  });

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={location}
      zoom={13}
      onLoad={handleMapLoad}
      options={{
        disableDefaultUI: true,
        gestureHandling: "greedy",
        styles: [
          {
            featureType: "poi",
            elementType: "all",
            stylers: [{ visibility: "off" }],
          },
        ],
        clickableIcons: false
      }}
      onClick={() => setSelectedProperty(null)}
    >
      {selectedProperty && (
        <PropertyInfoWindow
          key={selectedProperty.id}
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onImageClick={handleImageClick}
        />
      )}
    </GoogleMap>
  );
};

export default MapWithMarkers;
