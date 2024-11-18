import React, { useEffect, useState, useRef } from 'react';
import { SlideMenuContainer, MenuContent, MenuItem } from './styles';
import { Link } from 'react-router-dom';

interface SlideMenuProps {
  onClose: () => void;
  isVisible: boolean;
}

const SlideMenu: React.FC<SlideMenuProps> = ({ onClose, isVisible }) => {
  const [slide, setSlide] = useState(-100); // Inicializa o menu fora da tela
  const menuRef = useRef<HTMLDivElement>(null);

  // Lógica para fechar o menu se o clique for fora do menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSlide(-100); // Fecha o menu
        setTimeout(() => onClose(), 300); // Chama o onClose após a animação
      }
    };

    if (isVisible) {
      setSlide(0); // Abre o menu
      document.addEventListener('click', handleClickOutside);
    } else {
      setSlide(-100); // Fecha o menu
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible, onClose]);

  // Função para lidar com o clique nos itens do menu
  const handleMenuItemClick = () => {
    setSlide(-100); // Fecha o menu
    setTimeout(() => onClose(), 300); // Chama onClose após a animação
  };

  return (
    <SlideMenuContainer ref={menuRef} $slide={slide}>
      <MenuContent>
        <MenuItem>
          <Link to="signIn" onClick={handleMenuItemClick}>Entrar</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/" onClick={handleMenuItemClick}>Home</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/map" onClick={handleMenuItemClick}>Mapa</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/list" onClick={handleMenuItemClick}>Lista</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/contact" onClick={handleMenuItemClick}>Fale conosco</Link>
        </MenuItem>
      </MenuContent>
    </SlideMenuContainer>
  );
};

export default SlideMenu;
