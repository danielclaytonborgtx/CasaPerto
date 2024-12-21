import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Item, Image, Title, Button } from './styles';

interface Property {
  id: number;
  title: string;
  price: string;
  description: string;
  images: { url: string }[]; 
}
const ListScreen: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:3333/property'); 
        if (response.ok) {
          const data = await response.json();
          setProperties(data); 
        } else {
          setError("Erro ao carregar os imóveis.");
        }
      } catch {
        setError("Erro ao conectar com o servidor.");
      } finally {
        setLoading(false); 
      }
    };

    fetchProperties(); 
  }, []);

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
      {properties.map((property) => {
        const imageUrl = property.images && property.images.length > 0 
          ? `http://localhost:3333${property.images[0]}` 
          : '/images/default-image.jpg';

        return (
          <Item key={property.id}>
            <Image src={imageUrl} alt={property.title} />
            <Title>{property.title}</Title>
            <p>{formatPrice(property.price)}</p>
            <Button onClick={() => navigate(`/property/${property.id}`, { state: property })}>Ver Detalhes</Button>
          </Item>
        );
      })}
    </Container>
  );
};

export default ListScreen;
