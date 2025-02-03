import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Item, Image, Title, Button, Price, SearchInput } from './styles';
import { usePropertyContext } from "../../contexts/PropertyContext";

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

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const toRad = (value: number) => value * (Math.PI / 180);
    const R = 6371; 
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://server-2-production.up.railway.app/property');
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
        } else {
          setError('Erro ao carregar os imóveis.');
        }
      } catch {
        setError('Erro ao conectar com o servidor.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();

    const getUserLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        () => {
          setError('Não foi possível obter a localização do usuário.');
          setLoading(false);
        }
      );
    };

    getUserLocation();
  }, []);

  const filteredProperties = properties
    .filter((property) => {
      const category = isRent ? "venda" : "aluguel";
      return property.category.toLowerCase() === category.toLowerCase();
    })
    .filter((property) => {
      const normalizedTitle = property.title.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
      const normalizedSearch = searchTerm.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
      return normalizedTitle.includes(normalizedSearch);
    });

  const sortedProperties = userLocation
    ? [...filteredProperties].sort((a, b) => {
        const distanceA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distanceB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distanceA - distanceB;
      })
    : filteredProperties;

  const formatPrice = (price: string | number) => {
    const priceString = typeof price === 'string' ? price : String(price);
    const priceNumber = parseFloat(priceString.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceNumber);
  };

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
          const imageUrl = property.images && property.images.length > 0
            ? `https://server-2-production.up.railway.app${property.images[0]}`
            : '/images/default-image.jpg';

          return (
            <Item key={property.id}>
              <Image src={imageUrl} alt={property.title} />
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