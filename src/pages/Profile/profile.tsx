import React, { useEffect, useState } from 'react';
import { useAuth } from '../../services/auth';
import { Imovel } from '../../@types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as S from './styles';
import { useNavigate } from 'react-router-dom';  // Importando useNavigate do react-router-dom

const Profile = () => {
  const { user, logout } = useAuth();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();  // Usando useNavigate para navegação

  interface Imagem {
    id: number;
    url: string;
  }

  useEffect(() => {
    if (!user?.id) {
      setError('Usuário não autenticado');
      setLoading(false);
      return;
    }

    const fetchImoveis = async () => {
      try {
        const response = await fetch(`https://casa-mais-perto-server-clone-production.up.railway.app/imoveis/user?userId=${user.id}`);
        if (!response.ok) {
          throw new Error('Falha ao buscar imóveis');
        }
        const data = await response.json();
        setImoveis(data);
      } catch (error) {
        setError('Este usuário ainda não tem imóveis.');
      } finally {
        setLoading(false);
      }
    };

    fetchImoveis();
  }, [user]);

  const handlePress = (imovelId: number) => {
    navigate(`/ProductDetail/${imovelId}`);  // Navegação com useNavigate
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');  // Navegando para a página inicial após logout
  };

  const handleEdit = (imovelId: number | undefined) => {
    if (imovelId) {
      navigate(`/EditProduct/${imovelId}`);  // Navegação para edição do imóvel
    } else {
      console.error('ID do imóvel inválido:', imovelId);
    }
  };

  const handleDelete = async (imovelId: number) => {
    Alert.alert(
      'Excluir Imóvel',
      'Você tem certeza que deseja excluir este imóvel?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              const imagensResponse = await fetch(`https://casa-mais-perto-server-clone-production.up.railway.app/imagens/imovel/${imovelId}`);
              const imagens: Imagem[] = await imagensResponse.json();

              if (imagens.length > 0) {
                await Promise.all(imagens.map((imagem: Imagem) => {
                  return fetch(`https://casa-mais-perto-server-clone-production.up.railway.app/imagens/${imagem.id}`, {
                    method: 'DELETE',
                  }).then((response) => {
                    if (!response.ok) {
                      throw new Error(`Falha ao excluir imagem com ID ${imagem.id}`);
                    }
                  });
                }));
              }

              const response = await fetch(`https://casa-mais-perto-server-clone-production.up.railway.app/imoveis/${imovelId}`, {
                method: 'DELETE',
              });

              if (response.ok) {
                setImoveis((prevImoveis) => prevImoveis.filter((imovel) => imovel.id !== imovelId));
                Alert.alert('Sucesso', 'Imóvel excluído com sucesso');
              } else {
                throw new Error('Erro ao excluir imóvel');
              }
            } catch (error) {
              Alert.alert('Erro ao excluir o imóvel. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  return (
    <S.Container>
      <S.Content>
        <S.Header>
          <S.Title>{user?.username || 'Usuário não logado'}</S.Title>
          <S.LogoutButton onClick={handleLogout}>
            <S.LogoutButtonText>Sair</S.LogoutButtonText>
          </S.LogoutButton>
        </S.Header>

        {loading ? (
          <S.Loading>Carregando...</S.Loading>
        ) : error ? (
          <S.ErrorText>{error}</S.ErrorText>
        ) : imoveis.length === 0 ? (
          <S.NoImoveisText>Nenhum imóvel encontrado.</S.NoImoveisText>
        ) : (
          <S.ImoveisList>
            {imoveis.map((item) => (
              <S.PropertyCard key={item.id}>
                <S.PropertyDetails onClick={() => handlePress(item.id)}>
                  <S.PropertyTitle>{item.titulo}</S.PropertyTitle>
                  <S.PropertyValue>
                    Valor: R$ {item.valor ? (item.valor / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'N/A'}
                  </S.PropertyValue>
                  <S.PropertyDescription>{item.descricao}</S.PropertyDescription>
                </S.PropertyDetails>
                <S.ImagesContainer>
                  {item.imagens.length > 0 && (
                    <S.Image src={item.imagens[0].url} alt={item.titulo} onClick={() => handlePress(item.id)} />
                  )}
                  <S.IconContainer>
                    <S.DeleteIcon onClick={() => handleDelete(item.id)}>
                      <MaterialCommunityIcons name="trash-can" size={20} color="black" />
                    </S.DeleteIcon>
                  </S.IconContainer>
                </S.ImagesContainer>
              </S.PropertyCard>
            ))}
          </S.ImoveisList>
        )}
      </S.Content>
    </S.Container>
  );
};

export default Profile;
