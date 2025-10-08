import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh; 
  padding: 16px;
  box-sizing: border-box;
  margin-top: 70px;
  margin-bottom: 80px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  min-height: calc(100vh - 150px);

  @media (max-width: 768px) {
    padding: 4px;
    margin-top: 40px;
    margin-bottom: 50px;
    min-height: calc(100vh - 90px);
    padding-bottom: 10px;
  }
`;

export const ContactForm = styled.form`
  width: 100%;
  max-width: 600px;
  padding: 24px;
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.15);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #00BFFF 0%, #007bff 100%);
  }

  label {
    font-size: 14px;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 6px;
    display: block;
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    gap: 8px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.1);
    margin-bottom: 12px;

    label {
      font-size: 11px;
      margin-bottom: 2px;
    }
  }
`;

export const InputField = styled.input`
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 14px 16px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  box-sizing: border-box;
  background: #ffffff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const TextArea = styled.textarea`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  min-height: 150px;
  resize: vertical; 
  margin-bottom: 10px;

  &:focus {
    outline: none;
    border-color: #87CEFA;
  }
`;

export const SubmitButton = styled.button`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 16px 24px;
  font-size: 16px;
  font-weight: 700;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 10px rgba(0, 123, 255, 0.3);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 48px; /* Tamanho mínimo para touch */

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0, 123, 255, 0.4);
    
    &::before {
      opacity: 1;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background: #cbd5e0;
    cursor: not-allowed;
  }
`;

export const Title = styled.h1`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1.8em;
  font-weight: 700;
  margin-bottom: 12px;
  text-align: center;
  color: #333;
  letter-spacing: 0.5px;
`;

export const Description = styled.p`
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 1em;
  text-align: center;
  margin-bottom: 24px;
  color: #4a5568;
  line-height: 1.5;
  max-width: 100%;

  strong {
    color: #007bff;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    font-size: 0.8em;
    margin-bottom: 12px;
    padding: 0 2px;
    line-height: 1.2;
  }
`;

export const InfoText = styled.p`
  font-size: 0.9em;
  text-align: center;
  color: #777;
  margin-top: 20px;
`;
