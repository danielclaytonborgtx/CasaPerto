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
`;

export const Button = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 50px;

  &:hover {
    background-color: #45a049;
  }
`;

export const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
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
