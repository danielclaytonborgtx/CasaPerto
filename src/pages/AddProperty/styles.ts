import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

export const Title = styled.h1`
  text-align: center;
  margin-bottom: 20px;
`;

export const Form = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Input = styled.input`
  padding: 10px;
  margin-bottom: 15px;
  font-size: 16px;
`;

export const TextArea = styled.textarea`
  padding: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  resize: none;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

export const ButtonText = styled.span`
  font-weight: bold;
`;

export const PhotoPreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 15px;
`;

export const PhotoPreview = styled.div`
  position: relative;
  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border: 1px solid #ddd;
  }
`;

export const RemovePhotoButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: red;
  color: white;
  border: none;
  padding: 5px;
  cursor: pointer;
  font-size: 12px;
`;

export const MapContainer = styled.div`
  margin-bottom: 15px;
`;

export const AddPhotoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0;
  label {
    cursor: pointer;
    color: #007bff;
    font-size: 16px;
    text-decoration: underline;
  }
  input {
    display: none;
  }
`;

export const ImagePreview = styled.div`
  position: relative;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 8px; /* Para bordas arredondadas */
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: red;
    color: white;
    border: none;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
  }
`;

export const MapWrapper = styled.div`
  width: 100%;
  height: 400px; /* Ajuste o tamanho conforme necessário */
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;

  /* Você pode adicionar outras regras de estilo conforme necessário */
`;