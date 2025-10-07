import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../services/authContext';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, Marker } from '@react-google-maps/api';
import { FileImage, MapPin, FileText, Info } from 'lucide-react';
import LoadingMessage from '../../components/loadingMessage/LoadingMessage';
import { supabaseProperties } from '../../services/supabaseProperties';
import { supabaseStorage } from '../../services/supabaseStorage';
import { supabase } from '../../lib/supabase';
import {
  AddPropertyContainer,
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
  MapWrapper,
  MapInstruction,
  Button,
  ButtonContainer,
  ErrorMessage,
  SuccessMessage,
} from './styles';

const AddProperty = () => {
  const { user, setUser } = useAuth(); 
  const navigate = useNavigate();

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

  // Calcular progresso do formulário
  const calculateProgress = () => {
    const steps = [
      category && name && price,
      description,
      images.length > 0,
      selectedMarker !== null
    ];
    return steps;
  };

  const progress = calculateProgress();

  return (
    <AddPropertyContainer>
      <PageHeader>
        <h1>Adicionar Imóvel</h1>
      </PageHeader>

      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <HelpText>Seja claro e objetivo para atrair mais interessados</HelpText>
        </FormGroup>

        <FormGroup>
          <Label required>Valor</Label>
          <FormInput
            type="text"
            placeholder="Ex: 350000"
            value={price}
            onChange={handlePriceChange}
          />
          <HelpText>Apenas números, sem pontos ou vírgulas</HelpText>
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
          {images.length} de 10 imagens • Limite total: 10 MB
        </ImageCounter>

        <ImageUploadButton>
          <label htmlFor="image-upload">
            <FileImage size={18} />
            {images.length === 0 ? 'Adicionar fotos' : 'Adicionar mais fotos'}
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

        {images.length > 0 && (
          <ImagePreviewContainer>
            {images.map((image, index) => (
              <ImagePreview key={index}>
                <img src={URL.createObjectURL(image)} alt={`preview-${index}`} />
                <button onClick={() => removeImage(index)}>×</button>
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
              : 'Clique no mapa para marcar a localização exata do imóvel. Arraste para navegar.'}
          </p>
        </MapInstruction>

        <MapWrapper>
          {isLoaded ? (
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
          ) : (
            <LoadingMessage />
          )}
        </MapWrapper>
      </Section>

      {/* Botão de Adicionar */}
      <ButtonContainer>
        <Button onClick={handleAddProperty} disabled={loading}>
          {loading ? 'Adicionando imóvel...' : 'Adicionar Imóvel'}
        </Button>
      </ButtonContainer>
    </AddPropertyContainer>
  );
};

export default AddProperty;
