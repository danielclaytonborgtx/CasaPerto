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
  const { user } = useAuth(); 
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

    const formData = new FormData();
    formData.append('category', category);
    formData.append('title', name);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('description1', description1);
    formData.append('userId', user.id.toString());
    formData.append('username', username); 
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

    images.forEach((image) => formData.append('images[]', image));

    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    try {
      const response = await axios.post(
        'https://server-2-production.up.railway.app/property',
        formData
      );

      if (response.status === 201) {
        setSuccessMessage('Imóvel adicionado com sucesso!');
        resetForm();
        navigate('/profile');
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
        placeholder="Preço"
        value={price}
        onChange={handlePriceChange}
      />
      <FormInput
        as="textarea"
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4} 
      />
      <FormInput
        as="textarea"
        placeholder="Detalhes ocultos, somente você verá no seu perfil."
        value={description1}
        onChange={(e) => setDescription1(e.target.value)}
        rows={4} 
      />
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
        <p>Agora abaixo, arraste a tela e com um clique marque o local do imóvel no mapa.</p>      
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
        </LoadScript>
      </MapWrapper>

      <Button onClick={handleAddProperty} disabled={loading}>
        {loading ? 'Adicionando...' : 'Adicionar Imóvel'}
      </Button>
    </AddPropertyContainer>
  );
};

export default AddProperty;
