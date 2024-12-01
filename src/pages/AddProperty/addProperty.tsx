import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../services/authContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
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
  const { user } = useAuth(); // Verificando se o usuário está logado
  const navigate = useNavigate();

  const [category, setCategory] = useState<'aluguel' | 'venda'>('venda');
  const [name, setName] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [price, setPrice] = useState('');
  const [details, setDetails] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [mapPosition, setMapPosition] = useState({ lat: 0, lng: 0 });
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Obter localização atual do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          setMapPosition({ lat: latitude, lng: longitude });
        },
        () => {
          alert('Falha ao obter localização. Usando localização padrão.');
          setMapPosition({ lat: -23.55052, lng: -46.633308 });
        }
      );
    } else {
      alert('Localização não disponível');
      setMapPosition({ lat: -23.55052, lng: -46.633308 });
    }
  }, []); // Esse useEffect roda uma única vez ao inicializar o componente

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    const newLat = event.latLng?.lat() ?? 0;
    const newLng = event.latLng?.lng() ?? 0;
    setLatitude(newLat);
    setLongitude(newLng);
    setMapPosition({ lat: newLat, lng: newLng });
    setSelectedMarker({ lat: newLat, lng: newLng });
  }, []);

  const handleAddProperty = async () => {
    // Validação de campos
    if (!category || !name.trim() || images.length === 0 || !price.trim() || parseFloat(price) <= 0 || !details.trim() || !user) {
      setErrorMessage('Por favor, preencha todos os campos corretamente e certifique-se de estar logado.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const formData = new FormData();
    formData.append('categoria', category);
    formData.append('titulo', name);
    formData.append('valor', price);
    formData.append('descricao', details);
    formData.append('userId', user.id.toString()); // Certificando-se de que o usuário está logado
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

    images.forEach((image) => formData.append('imagens[]', image));

    try {
      const response = await axios.post(
        'https://casa-mais-perto-server-clone-production.up.railway.app/imoveis',
        formData
      );
      if (response.status === 201) {
        setSuccessMessage('Imóvel adicionado com sucesso!');
        resetForm(); // Limpar os campos após o sucesso
        navigate('/profile'); // Redirecionar para o perfil
      } else {
        setErrorMessage('Erro ao adicionar imóvel. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        setErrorMessage(`Erro: ${error.response?.data.message || 'Tente novamente.'}`);
      } else {
        setErrorMessage('Erro ao adicionar imóvel. Tente novamente.');
      }
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
    URL.revokeObjectURL(URL.createObjectURL(removedImage)); // Limpa a memória
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
    setDetails('');
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
        placeholder="Preço"
        value={price}
        onChange={handlePriceChange}
      />
      <FormInput
        as="textarea"
        placeholder="Descrição"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={4} // Definindo a altura inicial, mas você pode ajustar conforme necessário
      />


      {/* Botão de adicionar imagens - sempre fixo acima das imagens */}
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

      {/* Visualização das imagens */}
      <ImagePreviewContainer>
        {images.map((image, index) => (
          <ImagePreview key={index}>
            <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
            <button onClick={() => removeImage(index)}>Remover</button>
          </ImagePreview>
        ))}
      </ImagePreviewContainer>

      <MapWrapper>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={mapPosition}
            zoom={15}
            onClick={handleMapClick}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
            }}
          >
            {selectedMarker && <Marker position={selectedMarker} />}
            <Marker position={mapPosition} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
          </GoogleMap>
        </LoadScript>
      </MapWrapper>

      <Button onClick={handleAddProperty} disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar Imóvel'}
      </Button>
    </AddPropertyContainer>
  );
};

export default AddProperty;
