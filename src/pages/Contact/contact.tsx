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
  
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }
  
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, insira um email válido.");
      return;
    }
  
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

      console.log('Resposta completa do EmailJS:', response);

      setName('');
      setEmail('');
      setMessage('');

      setSuccessMessage("Mensagem enviada com sucesso!");
      setErrorMessage("");
    } catch (error) {


      if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message);
      }
      setErrorMessage("Erro ao enviar mensagem. Tente novamente mais tarde.");
      setSuccessMessage("");
    }
  };

  return (
    <Container>
      <Title>Contato para cadastro</Title>
      <Description>Preencha o formulário abaixo e entraremos em contato com você, via email, certifique-se de colocar um email válido!</Description>
      <ContactForm onSubmit={handleSubmit}>
        <InputField 
          type="text" 
          placeholder="Seu nome completo" 
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
          placeholder="Aqui coloque seu numero do creci, e sua data de nascimento!" 
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
