import styled from 'styled-components';

export const EditPropertyContainer = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 50px auto;
  padding: 16px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 140px); /* Considerando header + footer */
  padding-top: 20px;
  padding-bottom: 100px; /* Espaço para o footer fixo */

  @media (min-width: 768px) {
    padding: 24px;
    padding-top: 40px;
    padding-bottom: 120px;
  }
`;

export const PageHeader = styled.div`
  margin-bottom: 24px;
  
  h1 {
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
    margin-bottom: 8px;
    
    @media (min-width: 768px) {
      font-size: 28px;
    }
  }
`;

export const ProgressIndicator = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
`;

export const ProgressStep = styled.div<{ active: boolean; completed: boolean }>`
  flex: 1;
  height: 4px;
  background-color: ${props => 
    props.completed ? '#00BFFF' : 
    props.active ? '#87CEEB' : 
    '#e0e0e0'};
  border-radius: 2px;
  transition: background-color 0.3s ease;
`;

export const Section = styled.div`
  background-color: #fff;
  border-radius: 12px;
  padding: 20px 16px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const Label = styled.label<{ required?: boolean }>`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4a4a4a;
  margin-bottom: 8px;

  ${props => props.required && `
    &::after {
      content: ' *';
      color: #ff4444;
    }
  `}
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #1a1a1a;
  background-color: #fff;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #00BFFF;
    box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  @media (min-width: 768px) {
    padding: 14px;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #1a1a1a;
  background-color: #fff;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #00BFFF;
    box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1);
  }

  &::placeholder {
    color: #999;
  }

  @media (min-width: 768px) {
    padding: 14px;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  color: #1a1a1a;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234a4a4a' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;

  &:focus {
    outline: none;
    border-color: #00BFFF;
    box-shadow: 0 0 0 3px rgba(0, 191, 255, 0.1);
  }

  @media (min-width: 768px) {
    padding: 14px;
    padding-right: 40px;
  }
`;

export const HelpText = styled.p`
  font-size: 13px;
  color: #666;
  margin-top: 6px;
  line-height: 1.4;
`;

export const ImageUploadButton = styled.div`
  margin-bottom: 16px;
  
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px;
    background-color: #f0f9ff;
    color: #00BFFF;
    border: 2px dashed #00BFFF;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background-color: #e6f7ff;
      border-color: #0099cc;
    }

    &:active {
      transform: scale(0.98);
    }
  }
`;

export const ImageCounter = styled.div`
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
`;

export const ImagePreviewContainer = styled.div`
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 4px;
  margin: -4px;
  
  /* Scrollbar customizado */
  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }
`;

export const ImagePreview = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 28px;
    height: 28px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 0, 0, 0.8);
      transform: scale(1.1);
    }
  }
`;

export const MapWrapper = styled.div`
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  /* Altura responsiva */
  height: 280px;
  
  @media (min-width: 768px) {
    height: 400px;
  }
`;

export const MapInstruction = styled.div`
  background-color: #f0f9ff;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  border-left: 4px solid #00BFFF;

  p {
    font-size: 14px;
    color: #0066a8;
    margin: 0;
    line-height: 1.5;
  }
`;

export const Button = styled.button`
  width: 100%;
  padding: 16px;
  background-color: #00BFFF;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 191, 255, 0.3);

  &:hover:not(:disabled) {
    background-color: #0099cc;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 191, 255, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #87CEEB;
    cursor: not-allowed;
    opacity: 0.7;
    box-shadow: none;
  }

  @media (min-width: 768px) {
    padding: 18px;
    font-size: 17px;
  }
`;

export const ButtonContainer = styled.div`
  margin-top: 24px;
  position: sticky;
  bottom: 40px; /* Acima do footer fixo */
  z-index: 10;
  background-color: #f5f5f5;
  padding: 16px 0;
  margin: 24px -16px 0;
  padding-left: 16px;
  padding-right: 16px;

  @media (min-width: 768px) {
    bottom: 100px;
    margin: 24px -24px 0;
    padding-left: 24px;
    padding-right: 24px;
  }
`;

export const ErrorMessage = styled.div`
  background-color: #fff0f0;
  color: #d32f2f;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  border-left: 4px solid #d32f2f;
`;

export const SuccessMessage = styled.div`
  background-color: #f0fff4;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  border-left: 4px solid #2e7d32;
`;

export const ImageBadge = styled.div<{ isNew?: boolean }>`
  position: absolute;
  bottom: 6px;
  left: 6px;
  background-color: ${props => props.isNew ? '#4caf50' : '#2196f3'};
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  text-transform: uppercase;
`;

export const CategorySelect = styled(Select)``;
export const CharacterCount = styled.span`
  font-size: 12px;
  color: #999;
  float: right;
  margin-top: 4px;
`;
