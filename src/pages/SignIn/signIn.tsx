import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Title, 
  Form, 
  Input, 
  Button, 
  ButtonText, 
  FooterText, 
  LinkText 
} from "./styles";

const SignIn: React.FC = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Lógica para login
    console.log("Usuário tentou fazer login");
  };

  return (
    <Container>
      <Title>Entrar no CasaPerto</Title>
      <Form>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Senha" />
        <Button onClick={handleSignIn}>
          <ButtonText>Entrar</ButtonText>
        </Button>
      </Form>
      <FooterText>
        Não tem conta? <LinkText onClick={() => navigate("/signup")}>Criar conta</LinkText>
      </FooterText>
    </Container>
  );
};

export default SignIn;
