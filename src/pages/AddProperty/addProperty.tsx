import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../services/authContext';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import LoadingMessage from '../../components/loadingMessage/LoadingMessage';
import { supabaseProperties } from '../../services/supabaseProperties';
import { supabaseStorage } from '../../services/supabaseStorage';
import { supabase } from '../../lib/supabase';
import {
  AddPropertyContainer,
  FormInput,
  Button,
  ImageUploadButton,
  ImagePreviewContainer,
  ImagePreview,
  MapWrapper,
} from './styles';

const AddProperty = () => {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');

  const [category, setCategory] = useState<'aluguel' | 'venda'>('venda');
  const [name, setName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [description1, setDescription1] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [mapPosition, setMapPosition] = useState({ lat: 0, lng: 0 });
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [isLoaded, setIsLoaded] = useState(false); 

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
  }, [user]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setMapPosition({ lat: latitude, lng: longitude });
          setIsLoaded(true);  
        },
        () => {
          alert('Falha ao obter localização. Usando localização padrão.');
          setMapPosition({ lat: -23.55052, lng: -46.633308 });
          setIsLoaded(true);  
        }
      );
    } else {
      alert('Localização não disponível');
      setMapPosition({ lat: -23.55052, lng: -46.633308 });
      setIsLoaded(true); 
    }
  }, []); 

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    const newLat = event.latLng?.lat() ?? 0;
    const newLng = event.latLng?.lng() ?? 0;
    setLatitude(newLat);
    setLongitude(newLng);
    setMapPosition({ lat: newLat, lng: newLng });
    setSelectedMarker({ lat: newLat, lng: newLng });
  }, []);

  const handleAddProperty = async () => {
    if (!user) {
      setErrorMessage('Você precisa estar logado para adicionar um imóvel.');
      return;
    }

    if (!category || !name.trim() || images.length === 0 || !price.trim() || parseFloat(price) <= 0 || !description.trim()) {
      setErrorMessage('Por favor, preencha todos os campos corretamente.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      // Upload das imagens para o Supabase Storage
      const imageUrls = await supabaseStorage.uploadPropertyImages(0, images); // 0 temporário, será atualizado após criar a propriedade

      // Verificar se a equipe existe antes de usar o team_id
      let validTeamId = null;
      if (user.teamMembers?.[0]?.teamId) {
        try {
          console.log('🔍 Verificando se a equipe existe...', user.teamMembers[0].teamId);
          const { data: teamExists, error: teamError } = await supabase
            .from('teams')
            .select('id')
            .eq('id', user.teamMembers[0].teamId)
            .single();
          
          if (teamError || !teamExists) {
            console.log('⚠️ Equipe não existe mais, limpando team_id do usuário');
            // Limpar team_id do usuário se a equipe não existe
            const updatedUser = {
              ...user,
              teamMembers: undefined
            };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            validTeamId = null;
          } else {
            console.log('✅ Equipe existe, usando team_id:', user.teamMembers[0].teamId);
            validTeamId = user.teamMembers[0].teamId;
          }
        } catch (error) {
          console.error('❌ Erro ao verificar equipe:', error);
          validTeamId = null;
        }
      }

      // Criar a propriedade no Supabase
      const propertyData = {
        title: name,
        description: description,
        description1: description1,
        price: price,
        category: category,
        latitude: latitude,
        longitude: longitude,
        user_id: user.id,
        team_id: validTeamId || undefined,
        images: imageUrls
      };

      const newProperty = await supabaseProperties.createProperty(propertyData);

      if (newProperty) {
        setSuccessMessage('Imóvel adicionado com sucesso!');
        resetForm();
        navigate('/profile');
      } else {
        setErrorMessage('Erro ao adicionar imóvel. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao adicionar imóvel:', error);
      setErrorMessage('Erro ao adicionar imóvel. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    const removedImage = images[index];
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    URL.revokeObjectURL(URL.createObjectURL(removedImage)); 
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value) && (value === '' || parseFloat(value) > 0)) {
      setPrice(value);
    }
  };

  const resetForm = () => {
    setCategory('venda');
    setName('');
    setImages([]);
    setPrice('');
    setDescription('');
    setLatitude(0);
    setLongitude(0);
    setMapPosition({ lat: 0, lng: 0 });
    setSelectedMarker(null);
  };

  return (
    <AddPropertyContainer>
      <h1>Adicionar Imóvel</h1>
      {errorMessage && <p style={{ color: 'red', fontWeight: 'bold', margin: '10px 0' }}>{errorMessage}</p>}
      {successMessage && <p style={{ color: 'green', fontWeight: 'bold', margin: '10px 0' }}>{successMessage}</p>}

      <FormInput
        as="select"
        value={category}
        onChange={(e) => setCategory(e.target.value as 'venda' | 'aluguel')}
      >
        <option value="venda">Venda</option>
        <option value="aluguel">Aluguel</option>
      </FormInput>

      <FormInput
        type="text"
        placeholder="Título"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FormInput
        type="text"
        placeholder="Valor"
        value={price}
        onChange={handlePriceChange}
      />
      <FormInput
        as="textarea"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={10} 
      />
      <FormInput
        as="textarea"
        placeholder="Detalhes ocultos, somente você verá no seu perfil. ex: contato do proprietario, valor de avalição..."
        value={description1}
        onChange={(e) => setDescription1(e.target.value)}
        rows={4} 
      />
      <p>É possivel carregar até 10 imagens, com o limite de 10 MB totais.</p>
      <ImageUploadButton>
        <label htmlFor="image-upload">Adicionar imagens</label>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleImageChange}
        />
      </ImageUploadButton>

      <ImagePreviewContainer>
        {images.map((image, index) => (
          <ImagePreview key={index}>
            <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
            <button onClick={() => removeImage(index)}>X</button>
          </ImagePreview>
        ))}
      </ImagePreviewContainer>
      
      <p>Agora abaixo, vamos marcar o local do imóvel, se voce está no imóvel agora, ele já atualiza a localização que voce está, se não, arraste a tela, e com um clique marque o local do imóvel no mapa.</p>
      <MapWrapper>
        
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={{ width: '100%', height: '500px' }}
              center={mapPosition}
              zoom={15}
              onClick={handleMapClick}
              options={{
                disableDefaultUI: true,
                zoomControl: false,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                gestureHandling: "greedy",
                styles: [
                  {
                    featureType: "poi",
                    elementType: "all",
                    stylers: [
                      {
                        visibility: "off",
                      },
                    ],
                  },
                ],
              }}
            >
              {selectedMarker && <Marker position={selectedMarker} />}
              <Marker position={mapPosition} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
            </GoogleMap>
          ) : (
            <LoadingMessage />
          )}
       
      </MapWrapper>

      <Button onClick={handleAddProperty} disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar Imóvel'}
      </Button>
    </AddPropertyContainer>
  );
};

export default AddProperty;
