import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button, ButtonContent, ButtonText } from './styles';
import { FaMapMarkedAlt, FaListAlt } from 'react-icons/fa';

const Footer: React.FC = () => {
  const navigate = useNavigate();

  const navigateTo = (path: string) => {
    navigate(path); 
  };

  return (
    <Container>
      <Button onClick={() => navigateTo('/map')}>
        <ButtonContent>
          <FaMapMarkedAlt size={24} color="black" /> 
          <ButtonText>Mapa</ButtonText>
        </ButtonContent>
      </Button>
      <Button onClick={() => navigateTo('/')}>
        <ButtonContent>
          <FaListAlt size={24} color="black" /> 
          
          <ButtonText>Lista</ButtonText>
        </ButtonContent>
      </Button>
    </Container>
  );
};

export default Footer;
