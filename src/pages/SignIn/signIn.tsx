import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/authContext";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [showPassword, setShowPassword] = useState(false);
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
        <div style={{ position: 'relative' }}>
          <Input 
            type={showPassword ? "text" : "password"} 
            name="password" 
            placeholder="Senha" 
            value={formData.password} 
            onChange={handleInputChange}
            style={{ paddingRight: '40px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              fontSize: '16px',
              padding: '5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
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
