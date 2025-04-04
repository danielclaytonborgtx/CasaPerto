import React, { useState } from 'react';
import emailjs from 'emailjs-com'; 
import { Container, ContactForm, InputField, SubmitButton, Title, Description, InfoText } from './styles';

const Contato: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [creci, setCreci] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!name.trim() || !email.trim() || !phone.trim() || !birthDate.trim() || !creci.trim()) {
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
      phone,
      birthDate,
      creci,
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
      setPhone('');
      setBirthDate('');
      setCreci('');

      setSuccessMessage("Cadastro enviado com sucesso!");
      setErrorMessage("");
    } catch (error) {
      if (error instanceof Error) {
        console.error("Mensagem de erro:", error.message);
      }
      setErrorMessage("Erro ao enviar cadastro. Tente novamente mais tarde.");
      setSuccessMessage("");
    }
  };

  return (
    <Container>
      <Title>Contato para cadastro</Title>
      <Description>Formulário para cadastro do usuário <strong> Corretor </strong> preencha abaixo e entraremos em contato com você. Certifique-se de colocar informações válidas!</Description>
      <ContactForm onSubmit={handleSubmit}>
        <label htmlFor="name">Nome completo</label>
        <InputField 
          type="text" 
          placeholder="" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required
        />
        <label htmlFor="email">Email</label>
        <InputField 
          type="email" 
          placeholder="" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required
        />
        <label htmlFor="phone">Telefone com DDD</label>
        <InputField 
          type="tel" 
          placeholder="" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)} 
          required
        />
        <label htmlFor="birthDate">Data de Nascimento</label>
        <InputField 
          type="date" 
          placeholder="" 
          value={birthDate} 
          onChange={(e) => setBirthDate(e.target.value)} 
          required
        />
        <label htmlFor="birthDate">Seu número do CRECI</label>
        <InputField 
          type="text" 
          placeholder="" 
          value={creci} 
          onChange={(e) => setCreci(e.target.value)} 
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
