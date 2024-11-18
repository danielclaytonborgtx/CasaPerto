import React from 'react';
import { useNavigate } from 'react-router-dom';

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
  ];

  const navigate = useNavigate();

  return (
    <div>
      {properties.map((property) => (
        <div key={property.id} onClick={() => navigate(`/property/${property.id}`, { state: property })}>
          <h3>{property.title}</h3>
          <img src={property.images[0]} alt={property.title} />
          <p>{property.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ListScreen;
