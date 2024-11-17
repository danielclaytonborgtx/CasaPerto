import React, { useState } from 'react';
import { Container, MenuButton, SearchInput, AddButton, Icon } from './styles';
import SlideMenu from '../../pages/SlideMenu/slideMenu';

const Header: React.FC = () => {
  const [isSlideMenuVisible, setSlideMenuVisible] = useState(false);

  const toggleSlideMenu = () => {
    setSlideMenuVisible(!isSlideMenuVisible);
  };

  return (
    <Container>
      <MenuButton onClick={toggleSlideMenu}>
        <Icon>☰</Icon>
      </MenuButton>
      <SearchInput type="text" placeholder="Buscar mais perto" />
      <AddButton>
        <Icon>+</Icon>
      </AddButton>

      {isSlideMenuVisible && <SlideMenu onClose={toggleSlideMenu} />}
    </Container>
  );
};

export default Header;
