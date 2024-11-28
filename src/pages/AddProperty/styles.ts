import styled from 'styled-components';

export const AddPropertyContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;

  &.select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    cursor: pointer;
  }

  // Estilo para textarea
  &.textarea {
    resize: vertical; // Permite que o usuário redimensione o campo verticalmente
    height: 100px; // Altura inicial, mas pode ser ajustada
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #00BFFF;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 50px;
  margin-top: 10px;

  &:hover {
    background-color: #87CEEB;
  }

  &:disabled {
    background-color: #cfcfcf;
    cursor: not-allowed;
  }
`;

export const ImageUploadButton = styled.div`
  margin-bottom: 20px;
  label {
    padding: 12px;
    background-color: #00BFFF;
    color: white;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    display: inline-block;
    width: 100%;
    text-align: center;
  }
`;

export const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

export const ImagePreview = styled.div`
  position: relative;

  img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 8px;
  }

  button {
    position: absolute;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    border-radius: 50%;
    padding: 5px;
    cursor: pointer;
  }
`;

export const MapWrapper = styled.div`
  margin-top: 20px;
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
`;

export const CategorySelect = styled(FormInput)`
  margin-top: 10px;
  font-size: 16px;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ddd;
`;
