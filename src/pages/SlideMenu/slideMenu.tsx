import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SlideMenuContainer, MenuItem, MenuContent } from './styles';

const SlideMenu: React.FC<{ onClose: () => void; isVisible: boolean }> = ({ onClose, isVisible }) => {
  const [slide, setSlide] = useState(-100); // Inicialmente o menu está fechado
  const menuRef = useRef<HTMLDivElement>(null);

  // Detectar quando o menu deve abrir ou fechar
  useEffect(() => {
    if (isVisible) {
      setSlide(0); // Menu abre suavemente
    } else {
      setSlide(-100); // Menu começa a fechar
    }
  }, [isVisible]);

  // Finaliza o fechamento com um timeout para garantir a animação
  useEffect(() => {
    if (slide === -100 && !isVisible) {
      const timeout = setTimeout(() => {
        onClose(); // Chama onClose após a animação de fechamento
      }, 300); // Espera o tempo da animação para fechar
      return () => clearTimeout(timeout);
    }
  }, [slide, isVisible, onClose]);

  // Detecta clique fora do menu para fechar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSlide(-100); // Inicia a animação de fechamento
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fechar menu ao clicar em qualquer item de menu
  const handleLinkClick = () => {
    setSlide(-100); // Inicia a animação de fechamento
  };

  return (
    <SlideMenuContainer ref={menuRef} $slide={slide}>
      <MenuContent>
        <MenuItem>
          <Link to="/signIn" onClick={handleLinkClick}>Entrar</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/" onClick={handleLinkClick}>Home</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/map" onClick={handleLinkClick}>Mapa</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/list" onClick={handleLinkClick}>Lista</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/contact" onClick={handleLinkClick}>Fale conosco</Link>
        </MenuItem>
      </MenuContent>
    </SlideMenuContainer>
  );
};

export default SlideMenu;
