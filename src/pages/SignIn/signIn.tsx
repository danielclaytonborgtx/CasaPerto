/* eslint-disable @typescript-eslint/no-unused-vars */

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

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ login: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Limpa o erro ao alterar os campos
  };

  const handleSignIn = async () => {
    if (!formData.login || !formData.password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://casa-mais-perto-server-clone-production.up.railway.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: formData.login,
          password: formData.password,
        }),
      });

      if (response.ok) {
        alert("Login bem-sucedido!");
        navigate("/profile"); 
        console.log("Navegando para o perfil...");
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao fazer login.");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <Container>
      <Title>Entrar no CasaPerto</Title>
      <Form>
        <Input 
          type="text" 
          name="login" 
          placeholder="Nome de usuário"
          value={formData.login} 
          onChange={handleInputChange} 
        />
        <Input 
          type="password" 
          name="password" 
          placeholder="Senha" 
          value={formData.password} 
          onChange={handleInputChange} 
        />
        {/* Verifica se error existe e exibe a mensagem */}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Button onClick={handleSignIn} disabled={isSubmitting}>
          <ButtonText>{isSubmitting ? "Entrando..." : "Entrar"}</ButtonText>
        </Button>
      </Form>
      <FooterText>
        Não tem conta? <LinkText onClick={() => navigate("/signup")}>Criar conta</LinkText>
      </FooterText>
    </Container>
  );
};

export default SignIn;
