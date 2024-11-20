import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Item, Image, Title, Button } from './styles';

const ListScreen: React.FC = () => {
  const properties = [
    {
      id: 1,
      title: 'Apartamento A',
      price: 'R$ 500.000',
      description: 'Excelente apartamento no centro.',
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },
    {
      id: 2,
      title: 'Apartamento B',
      price: 'R$ 300.000',
      description: 'Apartamento de 2 quartos em boa localização.',
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },
    {
      id: 3,
      title: 'Apartamento C',
      price: 'R$ 700.000',
      description: 'Excelente apartamento no centro.',
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },{
      id: 4,
      title: 'Apartamento D',
      price: 'R$ 100.000',
      description: 'Excelente apartamento no centro.',
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },{
      id: 5,
      title: 'Apartamento E',
      price: 'R$ 400.000',
      description: 'Excelente apartamento no centro.',
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },{
      id: 6,
      title: 'Apartamento F',
      price: 'R$ 500.000',
      description: 'Excelente apartamento no centro.',
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },{
      id: 7,
      title: 'Apartamento H',
      price: 'R$ 300.000',
      description: 'Excelente apartamento no centro.',
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },{
      id: 8,
      title: 'Apartamento I',
      price: 'R$ 600.000',
      description: 'Excelente apartamento no centro.',
      images: [
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
        'https://via.placeholder.com/150',
      ],
    },
  ];

  const navigate = useNavigate();

  return (
    <Container>
      {properties.map((property) => (
        <Item key={property.id} onClick={() => navigate(`/property/${property.id}`, { state: property })}>
          <Image src={property.images[0]} alt={property.title} />
          <Title>{property.title}</Title>
          <Button>Ver Detalhes</Button>
        </Item>
      ))}
    </Container>
  );
};

export default ListScreen;
