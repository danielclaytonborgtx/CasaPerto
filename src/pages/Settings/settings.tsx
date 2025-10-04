import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/authContext';
import { OptionsContainer, OptionItem, UserNameSpan, ProfileImage, ProfileIcon, ErrorMessage, EditButton } from './styles';
import { FiEdit } from 'react-icons/fi'; // Ícone de edição
import { supabaseProfile } from '../../services/supabaseProfile';
import { supabaseStorage } from '../../services/supabaseStorage';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null); 
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageInputRef, setImageInputRef] = useState<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      fetchProfileImage(String(user.id));
    }
  }, [user]);

  const fetchProfileImage = async (userId: string) => {
    try {
      console.log('🖼️ Settings: Carregando foto de perfil do usuário', userId);
      
      const profile = await supabaseProfile.getProfile(userId);
      
      if (profile?.profile_picture) {
        console.log('✅ Settings: Foto de perfil encontrada', profile.profile_picture);
        setProfileImage(profile.profile_picture);
      } else {
        console.log('🖼️ Settings: Nenhuma foto de perfil encontrada');
        setProfileImage(null);
      }
    } catch (error) {
      console.error('❌ Settings: Erro ao carregar foto de perfil', error);
      setProfileImage(null);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const userId = user?.id;
    if (!userId) {
      setError("Usuário não autenticado.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🖼️ Settings: Fazendo upload da nova foto de perfil');
      
      // Fazer upload da imagem para o Supabase Storage
      const imageUrl = await supabaseStorage.uploadProfilePicture(Number(userId), file);
      
      console.log('✅ Settings: Imagem carregada com sucesso', imageUrl);
      
      // Atualizar o perfil do usuário com a nova URL
      await supabaseProfile.updateProfilePicture(String(userId), imageUrl);
      
      // Atualizar a imagem local
      setProfileImage(imageUrl);
      
      console.log('✅ Settings: Foto de perfil atualizada com sucesso');
    } catch (error) {
      console.error('❌ Settings: Erro ao atualizar foto de perfil', error);
      setError("Erro ao atualizar foto de perfil. Tente novamente.");
    } finally {
      setLoading(false);
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
            <EditButton onClick={handleIconClick} disabled={loading}>
              {loading ? '⏳' : <FiEdit size={16} />}
            </EditButton>
            <input 
              type="file" 
              ref={setImageInputRef} 
              onChange={handleImageUpload} 
              style={{ display: "none" }}
              disabled={loading}
            />
          </div>
        ) : (
          <ProfileIcon>
            <button type="button" onClick={handleIconClick} disabled={loading}>
              <span>{loading ? '⏳' : '+'}</span>
            </button>
            <input 
              type="file" 
              ref={setImageInputRef} 
              onChange={handleImageUpload} 
              style={{ display: "none" }}
              disabled={loading}
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
