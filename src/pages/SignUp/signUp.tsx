import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Title, 
  Form, 
  Input, 
  Button, 
  ButtonText, 
  FooterText, 
  LinkText, 
  ErrorMessage 
} from "./styles";

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Limpa o erro ao alterar os campos
  };

  const handleSignUp = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }

    console.log("Dados enviados:", formData);
    // Lógica para salvar o usuário
    alert("Conta criada com sucesso!");
    navigate("/signin"); // Redireciona para a tela de login
  };

  return (
    <Container>
      <Title>Criar Conta</Title>
      <Form>
        <Input 
          type="text" 
          name="name" 
          placeholder="Nome" 
          value={formData.name} 
          onChange={handleInputChange} 
        />
        <Input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleInputChange} 
        />
        <Input 
          type="password" 
          name="password" 
          placeholder="Senha" 
          value={formData.password} 
          onChange={handleInputChange} 
        />
        <Input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirmar Senha" 
          value={formData.confirmPassword} 
          onChange={handleInputChange} 
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button onClick={handleSignUp}>
          <ButtonText>Criar Conta</ButtonText>
        </Button>
      </Form>
      <FooterText>
        Já tem conta? <LinkText onClick={() => navigate("/signIn")}>Entrar</LinkText>
      </FooterText>
    </Container>
  );
};

export default SignUp;
