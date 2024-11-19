import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SlideMenuContainer, MenuItem, MenuContent } from './styles';

const SlideMenu: React.FC<{ onClose: () => void; isVisible: boolean }> = ({ onClose, isVisible }) => {
  const [slide, setSlide] = useState(-100); // Inicialmente o menu está fechado
  const [closing, setClosing] = useState(false); // Flag para controlar se o menu está fechando
  const menuRef = useRef<HTMLDivElement>(null);

  // Efeito para animar a transição de abertura e fechamento do menu
  useEffect(() => {
    if (isVisible) {
      setSlide(0); // Menu desliza para a posição visível
      setClosing(false); // Garantir que o menu não está fechando
    } else if (!closing) {
      setClosing(true); // Marca o início do fechamento
      setSlide(-100); // Inicia o movimento de fechamento
    }
  }, [isVisible, closing]);

  // Detecta clique fora do menu para fechar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose(); // Fecha o menu ao clicar fora
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Realiza o fechamento definitivo após a animação
  useEffect(() => {
    if (closing) {
      const timeout = setTimeout(() => {
        if (!isVisible) {
          onClose(); // Chama onClose após o slide de fechamento
        }
      }, 300); // Delay para esperar a animação de fechamento
      return () => clearTimeout(timeout); // Limpa o timeout
    }
  }, [closing, isVisible, onClose]);

  return (
    <SlideMenuContainer ref={menuRef} $slide={slide}>
      <MenuContent>
        <MenuItem>
          <Link to="/signIn" onClick={() => onClose()}>Entrar</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/" onClick={() => onClose()}>Home</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/map" onClick={() => onClose()}>Mapa</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/list" onClick={() => onClose()}>Lista</Link>
        </MenuItem>
        <MenuItem>
          <Link to="/contact" onClick={() => onClose()}>Fale conosco</Link>
        </MenuItem>
      </MenuContent>
    </SlideMenuContainer>
  );
};

export default SlideMenu;
