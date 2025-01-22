// components/GoogleMapsProvider.tsx
import { LoadScript } from '@react-google-maps/api';

const GoogleMapsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}>
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;
