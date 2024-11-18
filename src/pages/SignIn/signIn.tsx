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
  const [formData, setFormData] = useState({ login: "", password: "" }); // Alteração para "login"
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para desabilitar o botão durante o envio
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Limpa o erro ao alterar os campos
  };

  const handleSignIn = async () => {
    if (!formData.login || !formData.password) { // Alteração para "login"
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true); // Bloqueia o botão enquanto está enviando os dados

    try {
      const response = await fetch("https://casa-mais-perto-server-clone-production.up.railway.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login: formData.login, // Mudança para "login"
          password: formData.password,
        }),
      });

      if (response.ok) {
        alert("Login bem-sucedido!");
        navigate("/profile"); // Redireciona para a página de perfil após o sucesso
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao fazer login.");
      }
    } catch (error) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false); // Libera o botão após o envio
    }
  };

  return (
    <Container>
      <Title>Entrar no CasaPerto</Title>
      <Form>
        <Input 
          type="text"  // Alterado para "text" para permitir tanto email quanto username
          name="login"  // Mudança para "login"
          placeholder="Nome de usuário"  // Mensagem do placeholder mais geral
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
