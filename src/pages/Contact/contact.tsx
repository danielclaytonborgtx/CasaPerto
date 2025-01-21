import React, { useState } from 'react';
import emailjs from 'emailjs-com'; 
import { Container, ContactForm, InputField, TextArea, SubmitButton, Title, Description, InfoText } from './styles';

const Contato: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const templateParams = {
      name,
      email,
      message,
    };

    try {
     
      const response = await emailjs.send(
        'service_jyxbbh9', 
        'template_utqrn4m',  
        templateParams,
        'llxBFEClVYH3PQwDq'      
      );
      console.log('Email enviado com sucesso:', response);
      setSuccessMessage("Mensagem enviada com sucesso!");
      setErrorMessage("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setErrorMessage("Erro ao enviar mensagem. Tente novamente mais tarde.");
      setSuccessMessage("");
    }
  };

  return (
    <Container>
      <Title>Entre em Contato</Title>
      <Description>Estamos aqui para ajudar! Preencha o formulário abaixo e entraremos em contato com você.</Description>
      <ContactForm onSubmit={handleSubmit}>
        <InputField 
          type="text" 
          placeholder="Seu nome" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
        />
        <InputField 
          type="email" 
          placeholder="Seu email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <TextArea 
          placeholder="Aqui deixe sua mensagem e seu contato!" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required
        />
        <SubmitButton type="submit">Enviar</SubmitButton>
      </ContactForm>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <InfoText>Ou envie um email diretamente para: danielclayton.imoveis@outlook.com</InfoText>
    </Container>
  );
};

export default Contato;
