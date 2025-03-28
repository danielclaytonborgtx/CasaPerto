import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, Marker } from '@react-google-maps/api';
import {
  EditPropertyContainer,
  FormInput,
  Button,
  ImageUploadButton,
  ImagePreviewContainer,
  ImagePreview,
  MapWrapper,
} from './styles';

interface PropertyData {
  id: string;
  category: 'venda' | 'aluguel';
  title: string;
  price: number;
  description: string;
  description1?: string;
  latitude: number;
  longitude: number;
  images: { url: string }[];
}

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [propertyData, setPropertyData] = useState<PropertyData | null>(null);
  const [category, setCategory] = useState<'aluguel' | 'venda'>('venda');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [description1, setDescription1] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string }[]>([]);
  const [mapPosition, setMapPosition] = useState({ lat: 0, lng: 0 });
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(
          `https://servercasaperto.onrender.com/property/${id}`
        );

        const data = response.data;
        setPropertyData(data);
        setCategory(data.category);
        setTitle(data.title);
        setPrice(data.price.toString());
        setDescription(data.description);
        setDescription1(data.description1 || '');
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setMapPosition({ lat: data.latitude, lng: data.longitude });
        setExistingImages(data.images || []);
        setIsLoaded(true);
      } catch (error) {
        console.error('Erro ao carregar imóvel:', error);
        setErrorMessage('Erro ao carregar os dados do imóvel.');
      }
    };

    fetchProperty();
  }, [id]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newLat = event.latLng.lat();
      const newLng = event.latLng.lng();
      setLatitude(newLat);
      setLongitude(newLng);
      setMapPosition({ lat: newLat, lng: newLng });
      setSelectedMarker({ lat: newLat, lng: newLng });
    }
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setNewImages((prev) => [...prev, ...Array.from(event.target.files!)]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateProperty = async () => {
    const parsedPrice = parseFloat(price);
    
    if (
      !category ||
      !title.trim() ||
      isNaN(parsedPrice) || 
      parsedPrice <= 0 ||
      !description.trim()
    ) {
      setErrorMessage('Por favor, preencha todos os campos obrigatórios corretamente.');
      return;
    }

    if (!existingImages.length && !newImages.length) {
      setErrorMessage('Adicione pelo menos uma imagem.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('category', category);
      formData.append('title', title);
      formData.append('price', parsedPrice.toString());
      formData.append('description', description);
      formData.append('description1', description1);
      formData.append('latitude', latitude.toString());
      formData.append('longitude', longitude.toString());
      
      // Envia as URLs das imagens existentes que devem ser mantidas
      formData.append('existingImages', JSON.stringify(existingImages.map(img => img.url)));

      // Adiciona novas imagens (arquivos)
      newImages.forEach((image) => {
        formData.append('images', image); // Nome do campo deve ser 'images' para match com o backend
      });

      const response = await axios.put(
        `https://servercasaperto.onrender.com/property/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage('Imóvel atualizado com sucesso!');
        setTimeout(() => navigate('/profile'), 1500);
      }
    } catch (error) {
      console.error('Erro ao atualizar imóvel:', error);
      setErrorMessage('Erro ao atualizar imóvel. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!propertyData) {
    return <div>Carregando dados do imóvel...</div>;
  }

  return (
    <EditPropertyContainer>
      <h1>Editar Imóvel</h1>
      
      {errorMessage && (
        <p style={{ color: 'red', fontWeight: 'bold', margin: '10px 0' }}>
          {errorMessage}
        </p>
      )}
      
      {successMessage && (
        <p style={{ color: 'green', fontWeight: 'bold', margin: '10px 0' }}>
          {successMessage}
        </p>
      )}

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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <FormInput
        type="number"
        placeholder="Valor"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="0.01"
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
        placeholder="Detalhes adicionais (opcional)"
        value={description1}
        onChange={(e) => setDescription1(e.target.value)}
        rows={4}
      />

      <ImageUploadButton>
        <label htmlFor="image-upload">Adicionar novas imagens</label>
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
        {/* Imagens existentes */}
        {existingImages.map((image, index) => (
          <ImagePreview key={`existing-${index}`}>
            <img 
              src={image.url.startsWith('http') ? image.url : `https://servercasaperto.onrender.com${image.url}`} 
              alt={`Imagem ${index + 1}`} 
            />
            <button onClick={() => removeExistingImage(index)}>X</button>
          </ImagePreview>
        ))}

        {/* Novas imagens */}
        {newImages.map((image, index) => (
          <ImagePreview key={`new-${index}`}>
            <img 
              src={URL.createObjectURL(image)} 
              alt={`Nova imagem ${index + 1}`} 
            />
            <button onClick={() => removeNewImage(index)}>X</button>
          </ImagePreview>
        ))}
      </ImagePreviewContainer>

      <p>Clique no mapa para atualizar a localização do imóvel:</p>
      
      <MapWrapper>
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '400px' }}
            center={mapPosition}
            zoom={15}
            onClick={handleMapClick}
            options={{
              disableDefaultUI: true,
              styles: [
                {
                  featureType: "poi",
                  elementType: "all",
                  stylers: [{ visibility: "off" }],
                },
              ],       
            }}
          >
            {selectedMarker && <Marker position={selectedMarker} />}
          </GoogleMap>
        ) : (
          <div>Carregando mapa...</div>
        )}
      </MapWrapper>

      <Button onClick={handleUpdateProperty} disabled={loading}>
        {loading ? 'Atualizando...' : 'Atualizar Imóvel'}
      </Button>
    </EditPropertyContainer>
  );
};

export default EditProperty;