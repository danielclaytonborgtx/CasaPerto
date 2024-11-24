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
  const [isSubmitting, setIsSubmitting] = useState(false); // Para desabilitar o botão durante o envio
  const navigate = useNavigate();

  // Função para atualizar os campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Limpa o erro ao alterar os campos
  };

  // Função para validar e enviar os dados do formulário
  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setIsSubmitting(true); // Bloqueia o botão enquanto está enviando os dados

    try {
      const response = await fetch("https://casa-mais-perto-server-clone-production.up.railway.app/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      // Checa se a resposta foi bem-sucedida
      if (response.ok) {
        alert("Conta criada com sucesso!");
        navigate("/signin"); // Redireciona para a tela de login após o sucesso
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao criar conta.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false); // Libera o botão após o envio
    }
  };

  return (
    <Container>
      <Title>Criar Conta</Title>
      <Form>
        {/* Campo Nome */}
        <Input 
          type="text" 
          name="name" 
          placeholder="Nome de usuário" 
          value={formData.name} 
          onChange={handleInputChange} 
        />
        {/* Campo Email */}
        <Input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleInputChange} 
        />
        {/* Campo Senha */}
        <Input 
          type="password" 
          name="password" 
          placeholder="Senha" 
          value={formData.password} 
          onChange={handleInputChange} 
        />
        {/* Campo Confirmar Senha */}
        <Input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirmar Senha" 
          value={formData.confirmPassword} 
          onChange={handleInputChange} 
        />
        {/* Exibição de erro */}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {/* Botão de envio */}
        <Button onClick={handleSignUp} disabled={isSubmitting}>
          <ButtonText>{isSubmitting ? "Criando..." : "Criar Conta"}</ButtonText>
        </Button>
      </Form>
      <FooterText>
        Já tem conta? <LinkText onClick={() => navigate("/signin")}>Entrar</LinkText>
      </FooterText>
    </Container>
  );
};

export default SignUp;
