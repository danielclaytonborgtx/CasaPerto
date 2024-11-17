import React from 'react';
import { SlideMenuContainer, CloseButton } from './styles';

interface SlideMenuProps {
  onClose: () => void;
}

const SlideMenu: React.FC<SlideMenuProps> = ({ onClose }) => {
  return (
    <SlideMenuContainer>
      <CloseButton onClick={onClose}>✖</CloseButton>
      {/* Adicione aqui os itens do menu */}
      <p>Item 1</p>
      <p>Item 2</p>
      <p>Item 3</p>
    </SlideMenuContainer>
  );
};

export default SlideMenu;
