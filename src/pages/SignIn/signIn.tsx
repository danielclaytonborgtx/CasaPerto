import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/authContext";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
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
  const { login } = useAuth();

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
      await login(formData.username, formData.password);
      alert("Login bem-sucedido!");
      navigate("/profile");  
    } catch {
      console.error("Erro no login:");
      setError("Erro ao fazer login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingMessage />;
  }

  return (
    <Container>
      <Title>Entrar no Casa Perto</Title>
      <Form>
        <Input 
          type="text" 
          name="username" 
          placeholder="Numero do Creci"
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
          <ButtonText>Entrar</ButtonText>
        </Button>
      </Form>
      <FooterText>
        {/* Não tem conta? <LinkText onClick={() => navigate("/signup")}>Criar conta</LinkText> */}
      </FooterText>
    </Container>
  );
};

export default SignIn;
