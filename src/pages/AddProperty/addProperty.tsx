import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Title, 
  Form, 
  Input, 
  TextArea, 
  Button, 
  ButtonText, 
  AddPhotoIcon, 
  MapContainer 
} from "./styles";

interface PropertyFormData {
  title: string;
  price: string;
  description: string;
  location: { lat: number; lng: number };
  photos: File[];
}

const AddProperty: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    price: "",
    description: "",
    location: { lat: 0, lng: 0 },
    photos: [],
  });

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData({ ...formData, photos: files });
  };

  const handleAddProperty = () => {
    console.log("Dados do Imóvel:", formData);
    alert("Imóvel adicionado com sucesso!");
    navigate("/");
  };

  return (
    <Container>
      <Title>Adicionar Imóvel</Title>
      <Form>
        <Input 
          type="text" 
          name="title" 
          placeholder="Título do Imóvel" 
          value={formData.title} 
          onChange={handleInputChange} 
        />
        <Input 
          type="text" 
          name="price" 
          placeholder="Preço do Imóvel (R$)" 
          value={formData.price} 
          onChange={handleInputChange} 
        />
        <TextArea 
          name="description" 
          placeholder="Descrição do Imóvel" 
          value={formData.description} 
          onChange={handleInputChange} 
        />
        <AddPhotoIcon>
          <label htmlFor="photo-upload">📷 Adicionar Fotos</label>
          <input 
            type="file" 
            id="photo-upload" 
            multiple 
            accept="image/*" 
            onChange={handlePhotoUpload} 
          />
        </AddPhotoIcon>
        <MapContainer>
          <p>Mapa para selecionar localização (clique no mapa).</p>
        </MapContainer>
        <Button onClick={handleAddProperty}>
          <ButtonText>Adicionar Imóvel</ButtonText>
        </Button>
      </Form>
    </Container>
  );
};

export default AddProperty;
