// ListScreen.tsx
import React from 'react';
import { Container, Item, Image, Title, Button } from './styles';

const ListScreen: React.FC = () => {
  // Lista de imóveis simulada (substitua com dados reais)
  const properties = [
    {
      id: 1,
      title: 'Apartamento A',
      image: 'https://via.placeholder.com/150', // Substitua pela URL da imagem real
      detailsLink: '/property/1', // Link para mais detalhes
    },
    {
      id: 2,
      title: 'Apartamento B',
      image: 'https://via.placeholder.com/150', // Substitua pela URL da imagem real
      detailsLink: '/property/2',
    },
    {
      id: 3,
      title: 'Apartamento C',
      image: 'https://via.placeholder.com/150', // Substitua pela URL da imagem real
      detailsLink: '/property/3',
    },
  ];

  return (
    <Container>
      {properties.map((property) => (
        <Item key={property.id}>
          <Image src={property.image} alt={property.title} />
          <Title>{property.title}</Title>
          <Button onClick={() => window.location.href = property.detailsLink}>Ver detalhes</Button>
        </Item>
      ))}
    </Container>
  );
};

export default ListScreen;
