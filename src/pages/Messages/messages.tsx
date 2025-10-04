import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/authContext"; 
import { supabaseMessages } from "../../services/supabaseMessages";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import {
  MessageContainer,
  MessageList,
  MessageItem,
  MessageInput,
  Button,
  ContactList,
  ContactItem,
  HeaderContainer,
} from "./styles";

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at?: string;
  sender?: {
    id: string;
    name: string;
    username: string;
  };
  receiver?: {
    id: string;
    name: string;
    username: string;
  };
}

interface Conversation {
  userId: string;
  userName: string;
  messages: Message[];
}

const Messages: React.FC = () => {
  const { brokerId } = useParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState<string>(""); 
  const [activeBrokerId, setActiveBrokerId] = useState<string | undefined>(brokerId);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useAuth();
  const senderId = user?.id;

  useEffect(() => {
    if (!senderId) {
      navigate("/login");
    }
  }, [senderId, navigate]);

  useEffect(() => {
    if (!senderId) return;

    const fetchConversations = async () => {
      try {
        console.log('🔍 Messages: Buscando conversas do usuário:', senderId);
        
        // Usar supabaseMessages para buscar conversas
        const conversationsData = await supabaseMessages.getUserConversations(senderId);
        
        console.log('✅ Messages: Conversas carregadas:', conversationsData);

        // Converter para o formato esperado pela interface
        const conversations = conversationsData.map(conv => ({
          userId: conv.user.id.toString(),
          userName: conv.user.name,
          messages: conv.lastMessage ? [conv.lastMessage] : [],
          unreadCount: conv.unreadCount
        }));

        console.log('✅ Messages: Conversas formatadas:', conversations);
        setConversations(conversations);
      } catch (error) {
        console.error("❌ Messages: Erro ao carregar conversas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [senderId]);

  // Polling inteligente para mensagens em tempo real
  useEffect(() => {
    if (!senderId) return;

    let isMounted = true;
    let lastCheckTime = new Date().toISOString();
    let intervalId: NodeJS.Timeout | null = null;

    const checkForNewMessages = async () => {
      if (!isMounted) return;
      
      try {
        // Buscar conversas atualizadas
        const conversationsData = await supabaseMessages.getUserConversations(senderId);
        
        const conversations = conversationsData.map(conv => ({
          userId: conv.user.id.toString(),
          userName: conv.user.name,
          messages: conv.lastMessage ? [conv.lastMessage] : [],
          unreadCount: conv.unreadCount
        }));

        // Verificar se há mudanças
        const hasChanges = conversations.some(conv => 
          conv.messages.length > 0 && 
          new Date(conv.messages[0].created_at) > new Date(lastCheckTime)
        );

        if (hasChanges) {
          console.log('✅ Messages: Novas mensagens detectadas!');
          setConversations(conversations);
          lastCheckTime = new Date().toISOString();
        }

        // Se há uma conversa ativa, também verificar mensagens dela
        if (activeBrokerId) {
          const messages = await supabaseMessages.getMessagesBetweenUsers(senderId, activeBrokerId);
          
          setConversations((prevConversations) => {
            const existingIndex = prevConversations.findIndex(
              (conv) => conv.userId === activeBrokerId
            );

            if (existingIndex !== -1) {
              const updatedConversations = [...prevConversations];
              updatedConversations[existingIndex] = {
                ...updatedConversations[existingIndex],
                messages: messages,
              };
              return updatedConversations;
            }
            
            return prevConversations;
          });
        }
      } catch (error) {
        console.error('❌ Messages: Erro ao verificar mensagens:', error);
      }
    };

    // Verificar mensagens a cada 2 segundos
    intervalId = setInterval(checkForNewMessages, 2000);

    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [senderId, activeBrokerId]);

  // Carregar dados iniciais quando há conversa ativa
  useEffect(() => {
    if (!senderId || !activeBrokerId) return;

    let isMounted = true;

    const fetchInitialData = async () => {
      if (!isMounted) return;
      
      try {
        console.log('🔍 Messages: Carregando dados iniciais da conversa...');
        
        // Buscar mensagens e nome do usuário em paralelo
        const [messages, userInfo] = await Promise.all([
          supabaseMessages.getMessagesBetweenUsers(senderId, activeBrokerId),
          fetchUserName(activeBrokerId)
        ]);
        
        console.log('✅ Messages: Dados iniciais carregados:', { 
          messagesCount: messages.length, 
          userName: userInfo 
        });

        setConversations((prevConversations) => {
          const existingIndex = prevConversations.findIndex(
            (conv) => conv.userId === activeBrokerId
          );

          const updatedConversation: Conversation = {
            userId: activeBrokerId,
            userName: userInfo || "Desconhecido",
            messages: messages,
          };

          if (existingIndex !== -1) {
            const updatedConversations = [...prevConversations];
            updatedConversations[existingIndex] = updatedConversation;
            return updatedConversations;
          } else {
            const newConversations = [...prevConversations, updatedConversation];
            return newConversations;
          }
        });
      } catch (error) {
        console.error("❌ Messages: Erro ao carregar dados iniciais", error);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [activeBrokerId, senderId]);

  // Função para buscar o nome do usuário
  const fetchUserName = async (userId: string): Promise<string | null> => {
    try {
      const { supabase } = await import('../../lib/supabase');
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Messages: Erro ao buscar nome do usuário:', error);
        return null;
      }

      return data?.name || null;
    } catch (error) {
      console.error('❌ Messages: Erro ao buscar nome do usuário:', error);
      return null;
    }
  };

  useEffect(() => {
    const now = new Date().toISOString();
    localStorage.setItem("lastSeenMessages", now);
  }, []);
  

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeBrokerId || !senderId) return;

    try {
      console.log('🔍 Messages: Enviando mensagem:', { 
        senderId, 
        receiverId: activeBrokerId, 
        content: newMessage 
      });

      // Usar supabaseMessages para enviar mensagem
      await supabaseMessages.sendMessage({
        sender_id: senderId,
        receiver_id: activeBrokerId,
        content: newMessage,
      });

      console.log('✅ Messages: Mensagem enviada com sucesso');

      // Buscar mensagens atualizadas
      const messages = await supabaseMessages.getMessagesBetweenUsers(
        senderId, 
        activeBrokerId
      );

      setConversations((prevConversations) => {
        const existingIndex = prevConversations.findIndex((conv) => conv.userId === activeBrokerId);

        const updatedConversation: Conversation = {
          userId: activeBrokerId,
          userName: conversations.find((conv) => conv.userId === activeBrokerId)?.userName || "Desconhecido",
          messages: messages,
        };

        if (existingIndex !== -1) {
          const updatedConversations = [...prevConversations];
          updatedConversations[existingIndex] = updatedConversation;
          return updatedConversations;
        } else {
          const newConversations = [...prevConversations, updatedConversation];
          return newConversations;
        }
      });

      setNewMessage("");
    } catch (error) {
      console.error("❌ Messages: Erro ao enviar a mensagem", error);
    }
  };

  const handleSelectBroker = (id: string) => {
    setActiveBrokerId(id);
    navigate(`/messages/${id}`);
  };

  if (loading) {
    return <LoadingMessage />;
  }

  return (
    <MessageContainer>
      <HeaderContainer>
        <h2>Mensagens</h2>
        <Button onClick={() => navigate("/brokers")}>Nova Mensagem</Button>
      </HeaderContainer>

      <div style={{ display: "flex" }}>
        <ContactList>
          {conversations.map((conversation, index) => (
            <ContactItem
              key={`${conversation.userId}-${index}`} 
              onClick={() => handleSelectBroker(conversation.userId)}
              style={{
                cursor: "pointer",
                fontWeight: activeBrokerId === conversation.userId ? "bold" : "normal",
              }}
            >
              <strong>{conversation.userName || "Desconhecido"}</strong>
            </ContactItem>
          ))}
        </ContactList>

        <div style={{ flex: 1, marginLeft: "10px" }}>
          {activeBrokerId && (
            <>
              <h3>
                Conversando com{" "}
                {conversations.find((conv) => conv.userId === activeBrokerId)?.userName || "Desconhecido"}
              </h3>
              <MessageList>
                {conversations
                  .find((conv) => conv.userId === activeBrokerId)
                  ?.messages?.length ? (
                  conversations
                    .find((conv) => conv.userId === activeBrokerId)
                    ?.messages.map((message, index) => {
                      const messageKey = `${activeBrokerId}-${message.id}-${index}`; 
                      const isFromCurrentUser = message.sender_id === senderId;
                      const senderName = isFromCurrentUser ? "Você" : (message.sender?.name || "Desconhecido");
                  
                      return (
                        <MessageItem key={messageKey} style={{
                          backgroundColor: isFromCurrentUser ? '#007bff' : '#f1f1f1',
                          color: isFromCurrentUser ? 'white' : 'black',
                          marginLeft: isFromCurrentUser ? 'auto' : '0',
                          marginRight: isFromCurrentUser ? '0' : 'auto',
                          maxWidth: '70%'
                        }}>
                          <strong>{senderName}</strong>
                          <p>{message.content}</p>
                          <small>{new Date(message.created_at).toLocaleString()}</small>
                        </MessageItem>
                      );
                    })
                ) : (
                  <p>Sem mensagens ainda.</p>
                )}
              </MessageList>

              <MessageInput
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
              />
              <Button onClick={handleSendMessage}>Enviar</Button>
            </>
          )}
        </div>
      </div>
    </MessageContainer>
  );
};

export default Messages;