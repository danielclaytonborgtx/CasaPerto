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

  // Função para manipular as mudanças nos campos de entrada
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Limpa o erro quando o campo é alterado
  };

  // Função para lidar com o envio do formulário
  const handleSignIn = async () => {
    if (!formData.login || !formData.password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true); // Ativa o estado de carregamento

    try {
      // Envia a requisição de login para o backend
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
        const data = await response.json();
        // Armazena o usuário no localStorage e no estado
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login bem-sucedido!");
        navigate("/profile"); // Navega para o perfil
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao fazer login."); // Exibe erro retornado pela API
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor."); // Mensagem de erro caso falhe a requisição
    } finally {
      setIsSubmitting(false); // Desativa o estado de carregamento
    }
  };

  return (
    <Container>
      <Title>Entrar no Casa Perto</Title>
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
        {/* Exibe mensagem de erro se houver algum */}
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
