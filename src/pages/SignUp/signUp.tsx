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
    console.log('📝 Input change:', name, '=', value);
    setFormData({ ...formData, [name]: value });
    setError(null); 
  };

  const handleSignUp = async () => {
    console.log('🎯 ===== INICIANDO PROCESSO DE CADASTRO =====')
    console.log('📋 Dados do formulário:', formData)
    console.log('📋 Estado isSubmitting:', isSubmitting)
    console.log('📋 Estado error:', error)

    const { name, email, username, password, confirmPassword } = formData;

    // Validações
    console.log('🔍 Verificando campos obrigatórios...')
    console.log('🔍 name:', name, 'email:', email, 'username:', username, 'password:', password, 'confirmPassword:', confirmPassword)
    
    if (!name || !email || !username || !password || !confirmPassword) {
      console.log('❌ Campos obrigatórios não preenchidos')
      console.log('❌ Detalhes:', { name: !!name, email: !!email, username: !!username, password: !!password, confirmPassword: !!confirmPassword })
      setError("Por favor, preencha todos os campos.");
      return;
    }

    console.log('✅ Campos obrigatórios OK, verificando username...')
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      console.log('❌ Username inválido:', username)
      setError("O nome de usuário deve ter entre 3 e 20 caracteres, sem espaços ou caracteres especiais.");
      return;
    }

    console.log('✅ Username OK, verificando senhas...')
    if (password !== confirmPassword) {
      console.log('❌ Senhas não coincidem')
      console.log('❌ password:', password, 'confirmPassword:', confirmPassword)
      setError("As senhas não correspondem.");
      return;
    }

    console.log('✅ Senhas coincidem, verificando tamanho...')
    if (password.length < 8) {
      console.log('❌ Senha muito curta:', password.length)
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    console.log('✅ Validações passaram, iniciando cadastro...')
    console.log('🔧 Verificando se supabaseAuth existe...')
    console.log('🔧 supabaseAuth:', typeof supabaseAuth)
    console.log('🔧 supabaseAuth.signUp:', typeof supabaseAuth?.signUp)
    
    setIsSubmitting(true);

    try {
      console.log('🔄 Chamando supabaseAuth.signUp...')
      console.log('📋 Dados sendo enviados:', { name, email, username, passwordLength: password.length })
      
      // Teste básico antes da chamada
      console.log('🧪 Testando se a função existe...')
      if (typeof supabaseAuth.signUp !== 'function') {
        throw new Error('supabaseAuth.signUp não é uma função!')
      }
      
      console.log('🧪 Função existe, chamando...')
      const userData = await supabaseAuth.signUp({
        name,
        email,
        username,
        password,
      });

      console.log('📊 Resultado do signUp:', userData)
      console.log('📊 Tipo do resultado:', typeof userData)
      console.log('📊 É null?', userData === null)
      console.log('📊 É undefined?', userData === undefined)

      if (userData) {
        console.log('✅ Usuário criado com sucesso!')
        console.log('📊 Dados do usuário criado:', {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          username: userData.username
        })
        alert("Conta criada com sucesso!");
        navigate("/signin"); 
      } else {
        console.log('⚠️ SignUp retornou null/undefined')
        console.log('🔍 Verificando se houve erro silencioso...')
        setError("Erro ao criar conta. Tente novamente.");
      }
    } catch (error: unknown) {
      console.error("💥 ERRO CAPTURADO:", error);
      console.error("💥 Tipo do erro:", typeof error);
      console.error("💥 É instância de Error?", error instanceof Error);
      
      // Log mais simples para garantir que aparece
      alert("ERRO: " + (error instanceof Error ? error.message : String(error)));
      
      if (error instanceof Error) {
        console.error("💥 Mensagem do erro:", error.message);
        console.error("💥 Stack trace:", error.stack);
      }
      const errorMessage = error instanceof Error ? error.message : "Erro ao conectar com o servidor.";
      console.log('📝 Mensagem de erro para o usuário:', errorMessage)
      setError(errorMessage);
    } finally {
      console.log('🏁 Finalizando processo de cadastro...')
      console.log('🏁 Estado final isSubmitting:', isSubmitting)
      setIsSubmitting(false);
      console.log('🏁 ===== FIM DO PROCESSO DE CADASTRO =====')
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
      <Form onSubmit={(e) => {
        e.preventDefault();
        console.log('📝 FORM SUBMIT PREVENTED');
        handleSignUp();
      }}>
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
     
        <Button type="submit" disabled={isSubmitting}>
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
