import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh; 
  padding: 20px;
  box-sizing: border-box;
  margin-top: 80px;
`;

export const ContactForm = styled.form`
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  gap: 15px; 
`;

export const InputField = styled.input`
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-bottom: 10px;
  
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
  padding: 12px;
  font-size: 16px;
  background-color: #00BFFF;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #87CEEB;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const Title = styled.h1`
  font-size: 30px;
  margin-bottom: 20px;
  text-align: center;
  color: #333;
`;

export const Description = styled.p`
  font-size: 18px;
  text-align: center;
  margin-bottom: 40px;
  color: #555;
`;

export const InfoText = styled.p`
  font-size: 16px;
  text-align: center;
  color: #777;
  margin-top: 20px;
`;
