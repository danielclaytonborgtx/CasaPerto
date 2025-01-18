import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
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
  category: 'venda' | 'aluguel';
  title: string;
  price: string;
  description: string;
  description1?: string;
  latitude: number;
  longitude: number;
  images: string[];
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
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<{ url: string }[]>([]);
  const [mapPosition, setMapPosition] = useState({ lat: 0, lng: 0 });
  const [selectedMarker, setSelectedMarker] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {

      try {
        const response = await axios.get(
          `https://server-2-production.up.railway.app/property/${id}`
        );

        const data = response.data;

        setPropertyData(data);
        setCategory(data.category);
        setTitle(data.title);
        setPrice(data.price);
        setDescription(data.description);
        setDescription1(data.description1);
        setLatitude(data.latitude);
        setLongitude(data.longitude);
        setMapPosition({ lat: data.latitude, lng: data.longitude });
        setExistingImages(data.images || []);
      } catch (error) {
        console.error(error);
        setErrorMessage('Erro ao carregar os dados do imóvel.');
      }
    };

    fetchProperty();
  }, [id]);

  const handleMapClick = useCallback((event: google.maps.MapMouseEvent) => {
    const newLat = event.latLng?.lat() ?? 0;
    const newLng = event.latLng?.lng() ?? 0;

    setLatitude(newLat);
    setLongitude(newLng);
    setMapPosition({ lat: newLat, lng: newLng });
    setSelectedMarker({ lat: newLat, lng: newLng });
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateProperty = async () => {
    console.log("Preparing to update property with data:", {
      category,
      title,
      price,
      description,
      description1,
      latitude,
      longitude,
      existingImages,
      newImages: images,
    });

    const parsedPrice = parseFloat(price); 
  
    if (
      !category ||
      !title.trim() ||
      (!images.length && !existingImages.length) ||
      isNaN(parsedPrice) || 
      parsedPrice <= 0 || 
      !description.trim()
    ) {
      console.warn("Validation failed. Check input values.");
      setErrorMessage('Por favor, preencha todos os campos corretamente.');
      return;
    }
  
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    const formData = new FormData();
    formData.append('category', category);
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    formData.append('description1', description1);
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('existingImages', JSON.stringify(existingImages));

    images.forEach((image) => formData.append('images[]', image));

    try {
      const response = await axios.put(
        `https://server-2-production.up.railway.app/property/${id}`,
        formData
      );

      if (response.status === 200) {
        setSuccessMessage('Imóvel atualizado com sucesso!');
        navigate('/profile');
      } else {
        setErrorMessage('Erro ao atualizar imóvel. Tente novamente.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Erro ao atualizar imóvel. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!propertyData) {
    return <p>Carregando dados do imóvel...</p>;
  }

  return (
    <EditPropertyContainer>
      <h1>Editar Imóvel</h1>
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
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <FormInput
        type="text"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
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
        placeholder="Detalhes ocultos"
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
  {existingImages.map((image, index) => {
    return (
      <ImagePreview key={index}>
        <img src={`https://server-2-production.up.railway.app${image.url}`} alt={`preview-${index}`} />
        <button onClick={() => removeExistingImage(index)}>X</button>
      </ImagePreview>
    );
  })}
  {images.map((image, index) => {
    return (
      <ImagePreview key={index}>
        <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
        <button onClick={() => setImages((prev) => prev.filter((_, i) => i !== index))}>X</button>
      </ImagePreview>
    );
  })}
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
          </GoogleMap>
        </LoadScript>
      </MapWrapper>

      <Button onClick={handleUpdateProperty} disabled={loading}>
        {loading ? 'Atualizando...' : 'Atualizar Imóvel'}
      </Button>
    </EditPropertyContainer>
  );
};

export default EditProperty;
