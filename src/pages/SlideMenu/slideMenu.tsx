import React, { useEffect, useState, useRef } from 'react';
import { SlideMenuContainer, MenuContent, MenuItem } from './styles';
import { Link } from 'react-router-dom';

interface SlideMenuProps {
  onClose: () => void;
  isVisible: boolean;
}

const SlideMenu: React.FC<SlideMenuProps> = ({ onClose, isVisible }) => {
  const [slide, setSlide] = useState(-100); 
  const menuRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSlide(-100); 
        setTimeout(() => onClose(), 300); 
      }
    };

    if (isVisible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside); 
    };
  }, [isVisible, onClose]);

  useEffect(() => {
    if (isVisible) {
      setSlide(0); 
    } else {
      setSlide(-100);
    }
  }, [isVisible]);

  const handleMenuItemClick = () => {
    setSlide(-100); 
    setTimeout(() => onClose(), 300); 
  };

  return (
    <SlideMenuContainer
      ref={menuRef} 
      style={{ transform: `translateX(${slide}%)`, transition: 'transform 0.3s ease' }}
    >
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
