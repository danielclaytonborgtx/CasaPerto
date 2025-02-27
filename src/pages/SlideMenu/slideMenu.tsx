import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { SlideMenuContainer, MenuItem, MenuContent, UserNameSpan, ProfileImage, DefaultIcon } from './styles';

const SlideMenu: React.FC<{ onClose: () => void; isVisible: boolean }> = ({ onClose, isVisible }) => {
  const { user } = useAuth();
  const [slide, setSlide] = useState(-100);
  const [profileImage, setProfileImage] = useState<string | null>(null);
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

  useEffect(() => {
    if (user?.id) {
      fetchProfileImage(user.id); 
    }
  }, [user]);

  const fetchProfileImage = async (userId: number) => {
    try {
      const response = await fetch(`https://servercasaperto.onrender.com/users/${userId}/profile-picture`);
      if (response.ok) {
        const data = await response.json();
        if (data.user?.picture) {
          setProfileImage(`https://servercasaperto.onrender.com${data.user.picture}`);
        } else {
          setProfileImage(null); 
        }
      } else {
        setProfileImage(null);
      }
    } catch {
      setProfileImage(null); 
    }
  };

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
          <MenuItem className="user" onClick={handleUserClick}>
            <UserNameSpan>
              {profileImage ? (
                <ProfileImage src={profileImage} alt="Foto de perfil" />
              ) : (
                <DefaultIcon>👤</DefaultIcon>
              )}
              {user.name}
            </UserNameSpan>
          </MenuItem>
        ) : (
          <MenuItem onClick={handleLinkClick}>
            <Link to="/signIn">Entrar</Link>
          </MenuItem>
        )}

        <MenuItem onClick={handleLinkClick}>
          <Link to="/">Home</Link>
        </MenuItem>
        <MenuItem onClick={handleLinkClick}>
          <Link to="/map">Mapa</Link>
        </MenuItem>
        <MenuItem onClick={handleLinkClick}>
          <Link to="/list">Lista</Link>
        </MenuItem>
        <MenuItem onClick={handleLinkClick}>
          <Link to="/contact">Fale conosco</Link>
        </MenuItem>
      </MenuContent>
    </SlideMenuContainer>
  );
};

export default SlideMenu;
