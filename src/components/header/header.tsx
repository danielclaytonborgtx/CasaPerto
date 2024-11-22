import React, { useState } from "react";
import { Container, MenuButton, SearchInput, AddButton, Icon } from "./styles";
import SlideMenu from "../../pages/SlideMenu/slideMenu";
import { useNavigate } from "react-router-dom";

import { FaBars, FaPlus } from "react-icons/fa";

const Header: React.FC = () => {
  const [isSlideMenuVisible, setSlideMenuVisible] = useState(false);
  const navigate = useNavigate();

  const toggleSlideMenu = () => {
    setSlideMenuVisible(!isSlideMenuVisible);
  };

  const handleAddPropertyClick = () => {
    const storedUser = localStorage.getItem("user"); // Verifica se o usuário está logado
    if (storedUser) {
      navigate("/addProperty"); // Redireciona para adicionar imóvel
    } else {
      navigate("/signIn"); // Redireciona para a tela de login
    }
  };

  return (
    <Container>
      <MenuButton onClick={toggleSlideMenu}>
        <Icon>
          <FaBars size={30} />
        </Icon>
      </MenuButton>
      <SearchInput type="text" placeholder="Buscar mais perto" />
      <AddButton onClick={handleAddPropertyClick}>
        <Icon>
          <FaPlus size={30} />
        </Icon>
      </AddButton>

      {isSlideMenuVisible && <SlideMenu onClose={toggleSlideMenu} isVisible={isSlideMenuVisible} />}
    </Container>
  );
};

export default Header;
