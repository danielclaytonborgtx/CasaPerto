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
  // LinkText, 
  ErrorMessage 
} from "./styles";

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

 
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); 
  };

  const handleSignIn = async () => {
    if (!formData.username || !formData.password) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("https://server-2-production.up.railway.app/session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username, 
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Login bem-sucedido!");
        navigate("/profile"); 
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao fazer login."); 
      }
    } catch {
      setError("Erro ao conectar com o servidor."); 
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Title>Entrar no Casa Perto</Title>
      <Form>
        <Input 
          type="text" 
          name="username" 
          placeholder="Nome de usuário"
          value={formData.username} 
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
        {/* Não tem conta? <LinkText onClick={() => navigate("/signup")}>Criar conta</LinkText> */}
      </FooterText>
    </Container>
  );
};

export default SignIn;
