import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/header/header';
import Footer from '../components/footer/footer'; 
import { Container, MainContent } from './styles';

const Layout: React.FC = () => {
  return (
    <Container>
      <Header />
      <MainContent>
        <Outlet /> {/* Aqui é onde o conteúdo das páginas será renderizado */}
      </MainContent>
      <Footer />
    </Container>
  );
};

export default Layout;
