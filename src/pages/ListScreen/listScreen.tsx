import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Item, Image, Title, Button, Price, SearchInput } from './styles';
import { usePropertyContext } from "../../contexts/PropertyContext";

const DEFAULT_IMAGE = '/images/default-property.jpg';

interface Property {
  id: number;
  title: string;
  price: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  images: { url: string }[];
}

const ListScreen: React.FC = () => {
  const { isRent } = usePropertyContext();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => value * (Math.PI / 180);
    const R = 6371; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Carregar localização e propriedades em paralelo
        const [propertiesResponse, position] = await Promise.all([
          fetch('https://servercasaperto.onrender.com/property'),
          new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          })
        ]);

        if (propertiesResponse.ok) {
          const data = await propertiesResponse.json();
          setProperties(data);
        } else {
          setError('Erro ao carregar os imóveis.');
        }

        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
      } catch (error) {
        if (error instanceof Error && error.name === 'PositionError') {
          setError('Não foi possível obter a localização do usuário.');
        } else {
          setError('Erro ao conectar com o servidor.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Memoize filtered properties
  const filteredProperties = useMemo(() => {
    return properties
      .filter((property) => {
        const category = isRent ? "venda" : "aluguel";
        return property.category.toLowerCase() === category.toLowerCase();
      })
      .filter((property) => {
        const normalizedTitle = property.title.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
        const normalizedSearch = searchTerm.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
        return normalizedTitle.includes(normalizedSearch);
      });
  }, [properties, isRent, searchTerm]);

  // Memoize sorted properties with distances
  const sortedProperties = useMemo(() => {
    if (!userLocation) return filteredProperties;

    // Calculate distances once and store them
    const propertiesWithDistance = filteredProperties.map(property => ({
      ...property,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        property.latitude,
        property.longitude
      )
    }));

    // Sort by distance
    return propertiesWithDistance.sort((a, b) => a.distance - b.distance);
  }, [filteredProperties, userLocation, calculateDistance]);

  const formatPrice = useCallback((price: string | number) => {
    const priceString = typeof price === 'string' ? price : String(price);
    const priceNumber = parseFloat(priceString.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceNumber);
  }, []);

  const getImageUrl = useCallback((images: string[] | undefined) => {
    if (!images || images.length === 0) return DEFAULT_IMAGE;
    return images[0];
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container>
      <SearchInput
        type="text"
        placeholder="Buscar imóveis..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {sortedProperties.length === 0 ? (
        <div>Nenhum imóvel disponível para esta categoria.</div>
      ) : (
        sortedProperties.map((property) => {
          const imageUrl = getImageUrl(property.images as unknown as string[]);

          return (
            <Item key={property.id}>
              <Image 
                src={imageUrl}
                alt={property.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />
              <Title>{property.title}</Title>
              <Price>{formatPrice(property.price)}</Price>
              <Button onClick={() => navigate(`/property/${property.id}`, { state: property })}>
                Ver Detalhes
              </Button>
            </Item>
          );
        })
      )}
    </Container>
  );
};

export default ListScreen;