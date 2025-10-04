import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabaseAuth } from "../../services/supabaseAuth";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(null); 
  };

  const handleSignUp = async () => {
    console.log('🎯 Iniciando processo de cadastro...')
    console.log('📋 Dados do formulário:', formData)

    const { name, email, username, password, confirmPassword } = formData;

    // Validações
    if (!name || !email || !username || !password || !confirmPassword) {
      console.log('❌ Campos obrigatórios não preenchidos')
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      console.log('❌ Username inválido:', username)
      setError("O nome de usuário deve ter entre 3 e 20 caracteres, sem espaços ou caracteres especiais.");
      return;
    }

    if (password !== confirmPassword) {
      console.log('❌ Senhas não coincidem')
      setError("As senhas não correspondem.");
      return;
    }

    if (password.length < 8) {
      console.log('❌ Senha muito curta:', password.length)
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    console.log('✅ Validações passaram, iniciando cadastro...')
    setIsSubmitting(true);

    try {
      console.log('🔄 Chamando supabaseAuth.signUp...')
      const userData = await supabaseAuth.signUp({
        name,
        email,
        username,
        password,
      });

      console.log('📊 Resultado do signUp:', userData)

      if (userData) {
        console.log('✅ Usuário criado com sucesso!')
        alert("Conta criada com sucesso!");
        navigate("/signin"); 
      } else {
        console.log('⚠️ SignUp retornou null/undefined')
        setError("Erro ao criar conta. Tente novamente.");
      }
    } catch (error: unknown) {
      console.error("💥 Erro ao criar conta:", error);
      const errorMessage = error instanceof Error ? error.message : "Erro ao conectar com o servidor.";
      console.log('📝 Mensagem de erro para o usuário:', errorMessage)
      setError(errorMessage);
    } finally {
      console.log('🏁 Finalizando processo de cadastro...')
      setIsSubmitting(false);
    }
  };

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
        <Input
          type="text"
          name="name"
          placeholder="Nome completo"
          value={formData.name}
          onChange={handleInputChange}
          onKeyPress={(e) => handleKeyPress(e, "email")}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          onKeyPress={(e) => handleKeyPress(e, "username")}
        />
        <Input
          type="text"
          name="username"
          placeholder="Creci"
          value={formData.username}
          onChange={handleInputChange}
          onKeyPress={(e) => handleKeyPress(e, "password")}
        />
        <div style={{ position: 'relative' }}>
          <Input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Senha"
            value={formData.password}
            onChange={handleInputChange}
            onKeyPress={(e) => handleKeyPress(e, "confirmPassword")}
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
        <div style={{ position: 'relative' }}>
          <Input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirmar Senha"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onKeyPress={(e) => handleKeyPress(e)}
            style={{ paddingRight: '40px' }}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}
     
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
