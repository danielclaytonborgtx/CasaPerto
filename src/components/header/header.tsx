import React, { useState } from "react";
import { Container, MenuButton, AddButton, Icon, SwitchContainer, ModernSwitch, SwitchTrack, SwitchThumb, SwitchText } from "./styles";
import SlideMenu from "../../pages/SlideMenu/slideMenu";
import { useNavigate } from "react-router-dom";
import { FaBars, FaPlus } from "react-icons/fa";
import { usePropertyContext } from "../../contexts/PropertyContext";

const Header: React.FC = () => {
  const [isSlideMenuVisible, setSlideMenuVisible] = useState(false);
  const { isRent, setIsRent } = usePropertyContext();
  const navigate = useNavigate();

  const toggleSlideMenu = () => {
    setSlideMenuVisible(!isSlideMenuVisible);
  };

  const handleAddPropertyClick = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      navigate("/addProperty");
    } else {
      navigate("/signIn");
    }
  };

  const handleSwitchChange = () => {
    setIsRent(!isRent);
  };

  return (
    <Container>
      <MenuButton onClick={toggleSlideMenu}>
        <Icon>
          <FaBars size={25} />
        </Icon>
      </MenuButton>

      <SwitchContainer>
        <ModernSwitch onClick={handleSwitchChange}>
          <SwitchTrack $isActive={isRent}>
            <SwitchText $isActive={!isRent}>Aluguel</SwitchText>
            <SwitchThumb $isActive={isRent} />
            <SwitchText $isActive={isRent}>Venda</SwitchText>
          </SwitchTrack>
        </ModernSwitch>
      </SwitchContainer>

      <AddButton onClick={handleAddPropertyClick}>
        <Icon>
          <FaPlus size={25} />
        </Icon>
      </AddButton>

      {isSlideMenuVisible && <SlideMenu onClose={toggleSlideMenu} isVisible={isSlideMenuVisible} />}
    </Container>
  );
};

export default Header;
