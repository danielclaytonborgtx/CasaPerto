import React, { useState } from 'react';
import { Container, MenuButton, SearchInput, AddButton, Icon } from './styles';
import SlideMenu from '../../pages/SlideMenu/slideMenu';

import { FaBars, FaPlus } from 'react-icons/fa';

const Header: React.FC = () => {
  const [isSlideMenuVisible, setSlideMenuVisible] = useState(false);

  const toggleSlideMenu = () => {
    setSlideMenuVisible(!isSlideMenuVisible);
  };

  return (
    <Container>
      <MenuButton onClick={toggleSlideMenu}>
        <Icon>
          <FaBars size={25}/>
        </Icon>
      </MenuButton>
      <SearchInput type="text" placeholder="Buscar mais perto" />
      <AddButton>
        <Icon>
          <FaPlus size={25}/>
        </Icon>
      </AddButton>

      {isSlideMenuVisible && <SlideMenu onClose={toggleSlideMenu} />}
    </Container>
  );
};

export default Header;
