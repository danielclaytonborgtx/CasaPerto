import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { OptionsContainer, OptionItem, UserNameSpan, ProfileImage, ProfileIcon, ErrorMessage, EditButton } from './styles';
import { FiEdit } from 'react-icons/fi'; // Ícone de edição

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null); 
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageInputRef, setImageInputRef] = useState<HTMLInputElement | null>(null);
  const navigate = useNavigate();

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
        if (data?.user?.picture) {
          // Aqui, você deve usar diretamente a URL fornecida pela API (sem tentar concatenar com o Cloudinary)
          const imageUrl = data.user.picture;  // Usar a URL completa da imagem fornecida pela API
          setProfileImage(imageUrl);
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    const userId = user?.id;
    if (!userId) {
      setError("Usuário não autenticado.");
      return;
    }

    try {
      const response = await fetch(`https://servercasaperto.onrender.com/users/${userId}/profile-picture`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.user?.picture) {
          setProfileImage(`https://servercasaperto.onrender.com${data.user.picture}`);
        } else {
          setError("Caminho da imagem não encontrado na resposta da API.");
        }
      } else {
        setError("Erro ao enviar imagem de perfil.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      setError("Erro ao conectar com o servidor.");
    }
  };

  const handleIconClick = () => {
    imageInputRef?.click();
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Tem certeza que deseja sair?");
    if (!confirmLogout) return;
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <OptionsContainer>
      <UserNameSpan>  
        {profileImage ? (
          <div style={{ position: "relative", display: "inline-block" }}>
            <ProfileImage src={profileImage} alt="Foto de perfil" />
            {/* Botão pequeno para trocar a imagem */}
            <EditButton onClick={handleIconClick}>
              <FiEdit size={16} />
            </EditButton>
            <input 
              type="file" 
              ref={setImageInputRef} 
              onChange={handleImageUpload} 
              style={{ display: "none" }} 
            />
          </div>
        ) : (
          <ProfileIcon>
            <button type="button" onClick={handleIconClick}>
              <span>+</span>
            </button>
            <input 
              type="file" 
              ref={setImageInputRef} 
              onChange={handleImageUpload} 
              style={{ display: "none" }} 
            />
          </ProfileIcon>
        )}

        <div>Nome - {user?.name}</div>
        <div>Creci - {user?.username}</div>
        <div>Email - {user?.email}</div>               
      </UserNameSpan>

      <OptionItem onClick={handleLogout}>
        Sair
      </OptionItem>
    </OptionsContainer>
  );
};

export default Settings;
