import React, { useState } from 'react';
import { supabaseVisitors } from '../../services/supabaseVisitors';
import { User, Phone, MessageSquare, Send } from 'lucide-react';
import {
  FormContainer,
  FormTitle,
  FormGroup,
  Label,
  Input,
  TextArea,
  SubmitButton,
  SuccessMessage,
  ErrorMessage,
  LoadingSpinner
} from './styles';

interface VisitorMessageFormProps {
  brokerId: string;
  brokerName: string;
  onSuccess?: () => void;
}

const VisitorMessageForm: React.FC<VisitorMessageFormProps> = ({
  brokerId,
  brokerName,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Aplicar máscara para telefone
    if (name === 'phone') {
      const phoneValue = value.replace(/\D/g, ''); // Remove tudo que não é dígito
      const formattedPhone = phoneValue.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validar dados
      if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      // Validar telefone
      const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        throw new Error('Por favor, insira um telefone válido no formato (11) 99999-9999.');
      }

      // Criar ou buscar visitante
      const visitor = await supabaseVisitors.createOrGetVisitor({
        name: formData.name.trim(),
        email: `${formData.phone.trim()}@visitor.local`, // Usar telefone como email único
        phone: formData.phone.trim()
      });

      // Enviar mensagem
      await supabaseVisitors.sendVisitorMessage({
        visitor_sender_id: visitor.id,
        receiver_id: brokerId,
        content: formData.message.trim()
      });

      setSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
      
      if (onSuccess) {
        onSuccess();
      }

    } catch (err: unknown) {
      console.error('Erro ao enviar mensagem:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <FormContainer>
        <SuccessMessage>
          <MessageSquare size={24} />
          <h3>Mensagem enviada com sucesso!</h3>
          <p>
            Sua mensagem foi enviada para <strong>{brokerName}</strong>. 
            Ele receberá uma notificação e poderá responder em breve.
          </p>
          <button 
            onClick={() => setSuccess(false)}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Enviar outra mensagem
          </button>
        </SuccessMessage>
      </FormContainer>
    );
  }

  return (
    <FormContainer>
      <FormTitle>
        <MessageSquare size={24} />
        Enviar mensagem para {brokerName}
      </FormTitle>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">
            <User size={16} />
            Nome completo *
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Seu nome completo"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="phone">
            <Phone size={16} />
            Telefone *
          </Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="(11) 99999-9999"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="message">
            <MessageSquare size={16} />
            Mensagem *
          </Label>
          <TextArea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Digite sua mensagem aqui..."
            rows={4}
            required
          />
        </FormGroup>

        {error && (
          <ErrorMessage>
            {error}
          </ErrorMessage>
        )}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner />
              Enviando...
            </>
          ) : (
            <>
              <Send size={16} />
              Enviar mensagem
            </>
          )}
        </SubmitButton>
      </form>
    </FormContainer>
  );
};

export default VisitorMessageForm;
