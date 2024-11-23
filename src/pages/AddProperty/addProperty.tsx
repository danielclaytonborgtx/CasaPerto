import React, { useState, useEffect } from 'react';
import { useAuth } from '../../services/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import {
  AddPropertyContainer,
  FormInput,
  Button,
  ImagePreviewContainer,
  ImagePreview,
  MapWrapper,
} from './styles';

const AddProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [price, setPrice] = useState<string>(''); 
  const [details, setDetails] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [mapPosition, setMapPosition] = useState({ lat: 0, lng: 0 });
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);  // Estado para carregar o botão de envio
  const [errorMessage, setErrorMessage] = useState(''); // Para mensagens de erro

  // Pega a localização atual do usuário
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setMapPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        }, () => {
          alert('Falha ao obter a localização. Usando localização padrão.');
          setMapPosition({ lat: -23.55052, lng: -46.633308 }); // Localização padrão (São Paulo)
        });
      } else {
        alert('Localização não disponível');
        setMapPosition({ lat: -23.55052, lng: -46.633308 }); // Localização padrão
      }
    };
    getCurrentLocation();
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const newLat = event.latLng?.lat() ?? 0;
    const newLng = event.latLng?.lng() ?? 0;
    setLatitude(newLat);
    setLongitude(newLng);
    setMapPosition({ lat: newLat, lng: newLng });
    setSelectedMarker({ lat: newLat, lng: newLng });  // Exibe o marcador na posição clicada
  };

  // Função para adicionar o imóvel
  const handleAddProperty = async () => {
    // Valida os campos obrigatórios
    if (!name || images.length === 0 || !price || !details || !user) {
      setErrorMessage('Por favor, preencha todos os campos e certifique-se de estar logado.');
      return;
    }
    setErrorMessage(''); // Limpa mensagem de erro
    setLoading(true); // Inicia o carregamento

    const formData = new FormData();
    formData.append('titulo', name);
    formData.append('valor', price);  // Enviar preço como string
    formData.append('descricao', details);
    formData.append('userId', (user?.id || '').toString());
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

    images.forEach((image) => {
      formData.append('imagens[]', image);
    });

    try {
      // Certifique-se de que a URL do seu backend está correta
      const response = await axios.post(
        'https://casa-mais-perto-server-clone-production.up.railway.app/imoveis',
        formData,
      );

      // Verifique a resposta
      if (response.status === 200) {
        alert('Imóvel adicionado com sucesso!');
        setName('');
        setImages([]);
        setPrice('');
        setDetails('');
        setLatitude(0);
        setLongitude(0);
        navigate('/profile'); // Redireciona para o perfil do usuário
      } else {
        alert('Erro ao adicionar imóvel. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      alert('Erro ao adicionar imóvel. Tente novamente.');
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages(prevImages => [...prevImages, ...Array.from(files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d*$/.test(value) && (value === '' || parseFloat(value) > 0)) {
      setPrice(value);  // Mantém o valor como string para envio
    }
  };

  return (
    <AddPropertyContainer>
      <h1>Adicionar Imóvel</h1>
      
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <FormInput
        type="text"
        placeholder="Título"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FormInput
        type="text"
        placeholder="Preço"
        value={price}
        onChange={handlePriceChange}
      />
      <FormInput
        type="text"
        placeholder="Descrição"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
      />

      <ImagePreviewContainer>
        {images.map((image, index) => (
          <ImagePreview key={index}>
            <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
            <button onClick={() => removeImage(index)}>Remover</button>
          </ImagePreview>
        ))}
        <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      </ImagePreviewContainer>

      <MapWrapper>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={mapPosition}
            zoom={15}
            onClick={handleMapClick}
          >
            <Marker position={mapPosition} onClick={() => setSelectedMarker(mapPosition)} />
            {selectedMarker && (
              <InfoWindow position={mapPosition} onCloseClick={() => setSelectedMarker(null)}>
                <div>
                  <h3>Localização Selecionada</h3>
                  <p>Latitude: {mapPosition.lat}</p>
                  <p>Longitude: {mapPosition.lng}</p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      </MapWrapper>

      <Button onClick={handleAddProperty} disabled={loading}>
        {loading ? 'Carregando...' : 'Adicionar Imóvel'}
      </Button>
    </AddPropertyContainer>
  );
};

export default AddProperty;
