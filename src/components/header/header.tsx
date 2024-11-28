import React, { useState } from "react";
import { Container, MenuButton, AddButton, Icon, SwitchContainer } from "./styles";
import SlideMenu from "../../pages/SlideMenu/slideMenu";
import { useNavigate } from "react-router-dom";

import { FaBars, FaPlus } from "react-icons/fa";
import Switch from "react-switch"; 

const Header: React.FC = () => {
  const [isSlideMenuVisible, setSlideMenuVisible] = useState(false);
  const [isRent, setIsRent] = useState(true); // true para "Aluguel", false para "Venda"
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

  // Função para mudar o estado do slider
  const handleSwitchChange = (checked: boolean) => {
    setIsRent(checked);
  };

  return (
    <Container>
      <MenuButton onClick={toggleSlideMenu}>
        <Icon>
          <FaBars size={30} />
        </Icon>
      </MenuButton>

      <SwitchContainer>
        <Switch
          checked={isRent}
          onChange={handleSwitchChange}
          offColor="#ffffff"   // Cor de fundo quando "Aluguel" (cinza claro)
          onColor="#ffffff"    // Cor de fundo quando "Venda" (cinza claro)
          height={40}          
          width={160}           
          uncheckedIcon={<span style={{ fontSize: '20px', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', paddingRight: '100px' }}>Aluguel</span>}   
          checkedIcon={<span style={{ fontSize: '20px', color: 'black', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%', paddingLeft: '60px' }}>Venda</span>}  
          handleDiameter={35}   // Tamanho do botão redondo
          onHandleColor="#00BFFF" // Cor do botão redondo fixo (azul claro)
          offHandleColor="#00BFFF"  // Também aplica o azul claro ao botão redondo
        />
      </SwitchContainer>

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
