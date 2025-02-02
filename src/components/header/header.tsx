import React, { useState } from "react";
import { Container, MenuButton, AddButton, Icon, SwitchContainer } from "./styles";
import SlideMenu from "../../pages/SlideMenu/slideMenu";
import { useNavigate } from "react-router-dom";
import { FaBars, FaPlus } from "react-icons/fa";
import Switch from "react-switch";
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
            offColor="#E0FFFF"
            onColor="#E0FFFF"
            height={40}
            width={160}
            uncheckedIcon={
              <span style={{
                fontSize: '20px',
                color: 'black',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '110%',
                width: '100%',
                position: 'absolute',
                left: -48,
                textAlign: 'center', 
              }}>
                Aluguel
              </span>
            }
            checkedIcon={
              <span style={{
                fontSize: '20px',
                color: 'black',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '110%',
                width: '100%',
                position: 'absolute',
                right: -45,
                textAlign: 'center',
              }}>
                Venda
              </span>
            }
            handleDiameter={35}
            onHandleColor="#00BFFF"
            offHandleColor="#00BFFF"
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
