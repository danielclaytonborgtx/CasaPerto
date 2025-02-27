import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/header/header';
import Footer from '../components/footer/footer'; 
import { Container, MainContent } from './styles';

const Layout: React.FC = () => {
  const location = useLocation();

  // Condicional para verificar se a rota é a página PropertyDetails
  const noHeaderFooter = location.pathname.includes('/property/');

  return (
    <Container>
      {!noHeaderFooter && <Header />}
      <MainContent>
        <Outlet /> 
      </MainContent>
      {!noHeaderFooter && <Footer />}
    </Container>
  );
};

export default Layout;
