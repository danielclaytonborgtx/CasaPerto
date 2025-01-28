import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext'; 
import { SlideMenuContainer, MenuItem, MenuContent } from './styles';

const SlideMenu: React.FC<{ onClose: () => void; isVisible: boolean }> = ({ onClose, isVisible }) => {
  const { user } = useAuth(); 
  const [slide, setSlide] = useState(-100); 
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      setSlide(0);
    } else {
      setSlide(-100);
    }
  }, [isVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setSlide(-100);
        setTimeout(() => onClose(), 300);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleLinkClick = () => {
    setSlide(-100); 
  };

  const handleUserClick = () => {
    navigate('/profile');
    handleLinkClick(); 
  };

  return (
    <SlideMenuContainer ref={menuRef} $slide={slide}>
      <MenuContent>
        {user ? (
          <MenuItem>
            <span 
              onClick={handleUserClick} 
              style={{ cursor: 'pointer', fontSize: '18px', fontWeight: 'bold' }} 
            >
              {user.username}
            </span>
          </MenuItem>
        ) : (
          <MenuItem>
            <Link to="/signIn" onClick={handleLinkClick}>Entrar</Link>
          </MenuItem>
        )}

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
