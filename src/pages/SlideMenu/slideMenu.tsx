import React, { useEffect, useState, useRef, useCallback } from 'react';
import { SlideMenuContainer, MenuContent, MenuItem } from './styles';
import { Link } from 'react-router-dom';

interface SlideMenuProps {
  onClose: () => void;
  isVisible: boolean;
}

const SlideMenu: React.FC<SlideMenuProps> = ({ onClose, isVisible }) => {
  const [slide, setSlide] = useState(-100); 
  const menuRef = useRef<HTMLDivElement>(null);

  // Função de fechamento com animação
  const closeMenu = useCallback(() => {
    setSlide(-100); // Animação de fechamento
    setTimeout(() => {
      onClose(); // Chama onClose após a animação de 300ms
    }, 300); // Tempo da animação
  }, [onClose]);

  useEffect(() => {
    // Função para fechar o menu quando clicado fora
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    // Mostra o menu ou fecha, dependendo do estado de "isVisible"
    if (isVisible) {
      setSlide(0);  // Menu aparece
    } else {
      closeMenu(); // Chama a função de fechamento com animação
    }

    // Adiciona evento de clique fora
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isVisible, closeMenu]); // Adiciona closeMenu como dependência

  // Alteração para o clique nos itens do menu
  const handleMenuItemClick = (event: React.MouseEvent) => {
    event.preventDefault(); // Previne o comportamento padrão de navegação
    closeMenu(); // Fecha o menu com animação

    // Navega para a rota após o tempo da animação
    setTimeout(() => {
      window.location.href = (event.target as HTMLAnchorElement).href; // Navega para o link após animação
    }, 300); // Espera o tempo da animação para navegar
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
