import React, { useState, useEffect, useRef } from "react";
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
  ImagePreview,
  MapWrapper,
} from "./styles";
import { GoogleMap, Marker, useLoadScript, Circle } from "@react-google-maps/api";

const AddProperty: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    location: { lat: 0, lng: 0 },
    photos: [] as File[],
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setFormData((prev) => ({
          ...prev,
          location: { lat: latitude, lng: longitude },
        }));
      },
      () => {
        alert("Não foi possível obter a localização.");
      }
    );
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...files],
    }));
  };

  const handleMapDrag = () => {
    if (mapRef.current) {
      const center = mapRef.current.getCenter();
      if (center) {
        const lat = center.lat();
        const lng = center.lng();
        setFormData((prev) => ({
          ...prev,
          location: { lat, lng },
        }));
      }
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleAddProperty = async () => {
    const { title, price, description, photos, location } = formData;

    if (!title || !price || !description || photos.length === 0) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("titulo", title);
      formDataToSend.append("valor", price);
      formDataToSend.append("descricao", description);
      formDataToSend.append("latitude", location.lat.toString());
      formDataToSend.append("longitude", location.lng.toString());
      photos.forEach((photo) => formDataToSend.append("imagens", photo));

      const response = await fetch(
        "https://casa-mais-perto-server-clone-production.up.railway.app/imoveis",
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro ao adicionar imóvel:", errorData);
        throw new Error(errorData.message || "Erro ao adicionar imóvel.");
      }

      alert("Imóvel adicionado com sucesso!");
      navigate("/profile");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao adicionar imóvel. Tente novamente.");
    }
  };

  if (!isLoaded) return <div>Carregando mapa...</div>;

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
        <ImagePreview>
          {formData.photos.map((photo, index) => (
            <div key={index} style={{ position: "relative", margin: "5px" }}>
              <img
                src={URL.createObjectURL(photo)}
                alt={`Foto ${index + 1}`}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <button
                onClick={() => handleRemovePhoto(index)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  backgroundColor: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              >
                X
              </button>
            </div>
          ))}
        </ImagePreview>
        <MapWrapper>
          <GoogleMap
            mapContainerStyle={{
              width: "100%",
              height: "300px",
            }}
            center={formData.location}
            zoom={15}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
            }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
            onDragEnd={handleMapDrag}
          >
            {/* Ponto Azul para localização do usuário */}
            {userLocation && (
              <Circle
                center={userLocation}
                radius={10}
                options={{
                  fillColor: "#0000FF",
                  fillOpacity: 1,
                  strokeColor: "#0000FF",
                  strokeOpacity: 0.5,
                  strokeWeight: 2,
                }}
              />
            )}
            {/* Marcador vermelho no centro */}
            <Marker position={formData.location} />
          </GoogleMap>
        </MapWrapper>
        <Button onClick={handleAddProperty} style={{ marginBottom: 70 }}>
          <ButtonText>Adicionar Imóvel</ButtonText>
        </Button>
      </Form>
    </Container>
  );
};

export default AddProperty;
