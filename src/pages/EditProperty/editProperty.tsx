import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { FileImage, MapPin, FileText, Info } from 'lucide-react';
import LoadingMessage from '../../components/loadingMessage/LoadingMessage';
import {
  EditPropertyContainer,
  PageHeader,
  ProgressIndicator,
  ProgressStep,
  Section,
  SectionTitle,
  FormGroup,
  Label,
  FormInput,
  TextArea,
  Select,
  HelpText,
  ImageUploadButton,
  ImageCounter,
  ImagePreviewContainer,
  ImagePreview,
  ImageBadge,
  MapWrapper,
  MapInstruction,
  Button,
  ButtonContainer,
  ErrorMessage,
  SuccessMessage,
} from './styles';

interface PropertyData {
  id: number;
  category: string;
  title: string;
  price: string;
  description: string;
  description1?: string;
  latitude: number;
  longitude: number;
  images: string[] | { url: string }[];
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
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<google.maps.LatLngLiteral | null>(null);
  const [mapPosition, setMapPosition] = useState<google.maps.LatLngLiteral>({
    lat: -23.550520,
    lng: -46.633308,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const { supabaseProperties } = await import('../../services/supabaseProperties');
        const property = await supabaseProperties.getPropertyById(Number(id));

        if (!property) {
          setErrorMessage('Imóvel não encontrado.');
          return;
        }

        console.log('🔍 EditProperty: Propriedade carregada', property);
        
        setPropertyData({
          ...property,
          description: property.description || '',
          description1: property.description1 || ''
        });
        setCategory(property.category as "venda" | "aluguel");
        setTitle(property.title);
        setPrice(property.price.toString());
        setDescription(property.description || '');
        setDescription1(property.description1 || '');
        setLatitude(property.latitude);
        setLongitude(property.longitude);
        setMapPosition({ lat: property.latitude, lng: property.longitude });
        // Converter imagens para o formato correto
        const images = property.images || [];
        const imageUrls = Array.isArray(images) 
          ? images.map(img => typeof img === 'string' ? img : img.url)
          : [];
        setExistingImages(imageUrls);
      } catch (error) {
        console.error('❌ Erro ao carregar imóvel:', error);
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
      
      formData.append('existingImages', JSON.stringify(existingImages));

      newImages.forEach((image) => {
        formData.append('images', image); 
      });

      // Processar novas imagens se houver
      let newImageUrls: string[] = [];
      if (newImages.length > 0) {
        console.log('🖼️ EditProperty: Fazendo upload de novas imagens', newImages.length);
        const { supabaseStorage } = await import('../../services/supabaseStorage');
        newImageUrls = await supabaseStorage.uploadPropertyImages(Number(id), newImages);
        console.log('🖼️ EditProperty: Novas imagens carregadas', newImageUrls);
      }

      // Combinar imagens existentes com novas
      const allImages = [...existingImages, ...newImageUrls];
      console.log('🖼️ EditProperty: Todas as imagens combinadas', allImages);

      const { supabaseProperties } = await import('../../services/supabaseProperties');
      const response = await supabaseProperties.updateProperty(Number(id), {
        title,
        description,
        description1,
        price,
        category,
        latitude,
        longitude,
        images: allImages
      });

      if (response) {
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
    return <LoadingMessage />;
  }

  // Calcular progresso do formulário
  const calculateProgress = () => {
    const steps = [
      category && title && price,
      description,
      existingImages.length > 0 || newImages.length > 0,
      selectedMarker !== null || (latitude && longitude)
    ];
    return steps;
  };

  const progress = calculateProgress();
  const totalImages = existingImages.length + newImages.length;

  return (
    <EditPropertyContainer>
      <PageHeader>
        <h1>Editar Imóvel</h1>
      </PageHeader>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      {loading ? (
        <LoadingMessage />
      ) : (
        <>
          {/* Indicador de Progresso */}
          <ProgressIndicator>
            <ProgressStep completed={!!progress[0]} active={!progress[0]} />
            <ProgressStep completed={!!progress[1]} active={!!progress[0] && !progress[1]} />
            <ProgressStep completed={!!progress[2]} active={!!progress[1] && !progress[2]} />
            <ProgressStep completed={!!progress[3]} active={!!progress[2] && !progress[3]} />
          </ProgressIndicator>

          {/* Seção: Informações Básicas */}
          <Section>
            <SectionTitle>
              <Info size={20} />
              Informações Básicas
            </SectionTitle>

            <FormGroup>
              <Label required>Tipo de Negócio</Label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'venda' | 'aluguel')}
              >
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label required>Título do Imóvel</Label>
              <FormInput
                type="text"
                placeholder="Ex: Apartamento 3 quartos no Centro"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <HelpText>Seja claro e objetivo para atrair mais interessados</HelpText>
            </FormGroup>

            <FormGroup>
              <Label required>Valor</Label>
              <FormInput
                type="number"
                placeholder="Ex: 350000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
              />
              <HelpText>Valor do imóvel</HelpText>
            </FormGroup>
          </Section>

          {/* Seção: Descrições */}
          <Section>
            <SectionTitle>
              <FileText size={20} />
              Descrições
            </SectionTitle>

            <FormGroup>
              <Label required>Descrição Pública</Label>
              <TextArea
                placeholder="Descreva as características do imóvel, localização, diferenciais..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={8}
              />
              <HelpText>Esta descrição será visível para todos</HelpText>
            </FormGroup>

            <FormGroup>
              <Label>Anotações Privadas</Label>
              <TextArea
                placeholder="Ex: Contato do proprietário, valor de avaliação, observações internas..."
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
                rows={4}
              />
              <HelpText>Apenas você terá acesso a estas informações</HelpText>
            </FormGroup>
          </Section>

          {/* Seção: Imagens */}
          <Section>
            <SectionTitle>
              <FileImage size={20} />
              Fotos do Imóvel
            </SectionTitle>

            <ImageCounter>
              {totalImages} de 10 imagens • 
              {existingImages.length > 0 && ` ${existingImages.length} existente(s)`}
              {newImages.length > 0 && ` • ${newImages.length} nova(s)`}
            </ImageCounter>

            <ImageUploadButton>
              <label htmlFor="image-upload">
                <FileImage size={18} />
                Adicionar novas fotos
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
            </ImageUploadButton>

            {(existingImages.length > 0 || newImages.length > 0) && (
              <ImagePreviewContainer>
                {existingImages.map((imageUrl, index) => (
                  <ImagePreview key={`existing-${index}`}>
                    <img 
                      src={imageUrl} 
                      alt={`Imagem ${index + 1}`} 
                    />
                    <button onClick={() => removeExistingImage(index)}>×</button>
                  </ImagePreview>
                ))}

                {newImages.map((image, index) => (
                  <ImagePreview key={`new-${index}`}>
                    <img 
                      src={URL.createObjectURL(image)} 
                      alt={`Nova imagem ${index + 1}`} 
                    />
                    <ImageBadge isNew>Nova</ImageBadge>
                    <button onClick={() => removeNewImage(index)}>×</button>
                  </ImagePreview>
                ))}
              </ImagePreviewContainer>
            )}
          </Section>

          {/* Seção: Localização */}
          <Section>
            <SectionTitle>
              <MapPin size={20} />
              Localização no Mapa
            </SectionTitle>

            <MapInstruction>
              <p>
                {selectedMarker 
                  ? '✓ Localização marcada! Você pode ajustar clicando em outro ponto do mapa.' 
                  : 'Clique no mapa para ajustar a localização do imóvel. Arraste para navegar.'}
              </p>
            </MapInstruction>

            <MapWrapper>
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
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
            </MapWrapper>
          </Section>

          {/* Botão de Salvar */}
          <ButtonContainer>
            <Button onClick={handleUpdateProperty} disabled={loading}>
              {loading ? 'Salvando alterações...' : 'Salvar Alterações'}
            </Button>
          </ButtonContainer>
        </>
      )}
    </EditPropertyContainer>
  );
};

export default EditProperty;