import React, { useState } from 'react';
import { Container, ContactForm, InputField, TextArea, SubmitButton, Title, Description, InfoText } from './styles';

const Contato: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Form Submitted:', { name, email, message });
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
          placeholder="Sua mensagem" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          required
        />
        <SubmitButton type="submit">Enviar</SubmitButton>
      </ContactForm>
      <InfoText>Ou envie um email diretamente para: danielclayton.imoveis@outlook.com</InfoText>
    </Container>
  );
};

export default Contato;
