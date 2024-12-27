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
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Atualiza os campos do formulário
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); // Limpa o erro ao alterar os campos
  };

  // Valida e envia os dados do formulário
  const handleSignUp = async () => {
    const { name, email, username, password, confirmPassword } = formData;

    if (!name || !email || !username || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      setError("O nome de usuário deve ter entre 3 e 20 caracteres, sem espaços ou caracteres especiais.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não correspondem.");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setIsSubmitting(true);

    console.log(import.meta.env.VITE_API_URL);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          username,
          password,
        }),
      });

      if (response.ok) {
        alert("Conta criada com sucesso!");
        navigate("/signin"); // Redireciona para a página de login
      } else {
        const data = await response.json();
        setError(data.error || "Erro ao criar conta.");
      }
    } catch {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Lida com a tecla Enter para mover o foco ou enviar o formulário
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, nextField?: string) => {
    if (e.key === "Enter") {
      if (nextField) {
        document.querySelector<HTMLInputElement>(`input[name='${nextField}']`)?.focus();
      } else {
        handleSignUp();
      }
    }
  };

  return (
    <Container>
      <Title>Criar Conta</Title>
      <Form>
        {/* Campo Nome Completo */}
        <Input
          type="text"
          name="name"
          placeholder="Nome completo"
          value={formData.name}
          onChange={handleInputChange}
          onKeyPress={(e) => handleKeyPress(e, "email")}
        />
        {/* Campo Email */}
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          onKeyPress={(e) => handleKeyPress(e, "username")}
        />
        {/* Campo Nome de Usuário */}
        <Input
          type="text"
          name="username"
          placeholder="Nome de usuário"
          value={formData.username}
          onChange={handleInputChange}
          onKeyPress={(e) => handleKeyPress(e, "password")}
        />
        {/* Campo Senha */}
        <Input
          type="password"
          name="password"
          placeholder="Senha"
          value={formData.password}
          onChange={handleInputChange}
          onKeyPress={(e) => handleKeyPress(e, "confirmPassword")}
        />
        {/* Campo Confirmar Senha */}
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar Senha"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          onKeyPress={(e) => handleKeyPress(e)}
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
