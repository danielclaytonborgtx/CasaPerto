import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Item, Image, Title, Button, Price, SearchInput } from './styles';
import { usePropertyContext } from "../../contexts/PropertyContext";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";

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

const Home: React.FC = () => {
  const { isRent } = usePropertyContext();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedProperties, setSortedProperties] = useState<Property[]>([]);
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
        const { supabaseProperties } = await import('../../services/supabaseProperties');
        const data = await supabaseProperties.getAllProperties();
        setProperties(data);
      } catch (err) {
        console.error('Erro ao carregar imóveis:', err);
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
        }
      );
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const filtered = properties
      .filter((property) => {
        const category = isRent ? "venda" : "aluguel";
        return property.category.toLowerCase() === category.toLowerCase();
      })
      .filter((property) => {
        const normalizedTitle = property.title.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
        const normalizedSearch = searchTerm.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
        return normalizedTitle.includes(normalizedSearch);
      });

    if (userLocation) {
      const sorted = [...filtered].sort((a, b) => {
        const distanceA = calculateDistance(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distanceB = calculateDistance(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distanceA - distanceB;
      });
      setSortedProperties(sorted);
    } else {
      setSortedProperties(filtered);
    }
  }, [properties, userLocation, searchTerm, isRent]);

  const formatPrice = (price: string | number) => {
    const priceString = typeof price === 'string' ? price : String(price);
    const priceNumber = parseFloat(priceString.replace('R$ ', '').replace('.', '').replace(',', '.'));
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(priceNumber);
  };

  if (loading) {
    return <LoadingMessage />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const getImageUrl = (images: string[] | undefined) => {
    if (!images || images.length === 0) return DEFAULT_IMAGE;
    return images[0];
  };

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

export default Home;
