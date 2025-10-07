import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../services/authContext"; 
import { supabaseMessages } from "../../services/supabaseMessages";
import { supabaseVisitors } from "../../services/supabaseVisitors";
import { supabaseDeleteMessages } from "../../services/supabaseDeleteMessages";
import LoadingMessage from "../../components/loadingMessage/LoadingMessage";
import {
  MessageContainer,
  MessageList,
  MessageItem,
  MessageInput,
  Button,
  ContactList,
  ContactItem,
  DeleteButton,
  HeaderContainer,
  MainContentArea,
  MessagesArea,
  ConversationHeader,
  MessageInputContainer,
  SendButton,
  ResponsiveWrapper,
  UnreadIndicator,
  ContactName,
} from "./styles";

interface Message {
  id: number;
  sender_id?: string;
  receiver_id?: string;
  visitor_sender_id?: string;
  visitor_receiver_id?: string;
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
  visitor_sender?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  visitor_receiver?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
}

interface Conversation {
  userId?: string;
  visitorId?: string;
  userName: string;
  userPhone?: string;
  isVisitor: boolean;
  messages: Message[];
  unreadCount: number;
  mainId?: string;
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
        // Usar supabaseVisitors para buscar conversas incluindo visitantes
        const conversationsData = await supabaseVisitors.getUserConversationsWithVisitors(String(senderId));

        // Converter para o formato esperado pela interface
        const conversations = conversationsData.map(conv => {
          // Para visitantes, usar visitorId como ID principal
          const mainId = conv.isVisitor ? conv.visitor?.id : conv.user?.id;
          const mainName = conv.isVisitor ? (conv.visitor?.name || 'Visitante') : (conv.user?.name || 'Usuário');
          
          return {
            userId: conv.isVisitor ? undefined : conv.user?.id,
            visitorId: conv.isVisitor ? conv.visitor?.id : undefined,
            userName: mainName,
            userPhone: conv.visitor?.phone,
            isVisitor: conv.isVisitor,
            messages: conv.lastMessage ? [conv.lastMessage] : [],
            unreadCount: conv.unreadCount,
            mainId: mainId
          };
        });

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
        // Buscar conversas atualizadas (incluindo visitantes)
        const conversationsData = await supabaseVisitors.getUserConversationsWithVisitors(String(senderId));
        
        const conversations = conversationsData.map(conv => ({
          userId: conv.user?.id?.toString() || undefined,
          visitorId: conv.visitor?.id,
          userName: conv.user?.name || conv.visitor?.name || 'Usuário',
          userPhone: conv.visitor?.phone,
          isVisitor: conv.isVisitor || false,
          messages: conv.lastMessage ? [conv.lastMessage] : [],
          unreadCount: conv.unreadCount
        }));

        // Verificar se há mudanças
        const hasChanges = conversations.some(conv => 
          conv.messages.length > 0 && 
          new Date(conv.messages[0].created_at) > new Date(lastCheckTime)
        );

        if (hasChanges) {
          setConversations(conversations);
          lastCheckTime = new Date().toISOString();
        }

        // Se há uma conversa ativa, também verificar mensagens dela
        if (activeBrokerId && activeBrokerId !== 'unknown') {
          const messages = await supabaseMessages.getMessagesBetweenUsers(String(senderId), String(activeBrokerId));
          
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
        // Primeiro tentar buscar como mensagens de visitante
        let messages: Message[] = [];
        let userInfo: string | null = null;
        let isVisitorConversation = false;
        
        try {
          const visitorMessages = await supabaseVisitors.getMessagesBetweenVisitorAndUser(
            activeBrokerId, 
            String(senderId)
          );
          
          if (visitorMessages && visitorMessages.length > 0) {
            messages = visitorMessages;
            isVisitorConversation = true;
            // Buscar nome do visitante
            if (visitorMessages[0].visitor_sender) {
              userInfo = visitorMessages[0].visitor_sender.name;
            }
          }
        } catch {
          // Se falhar, não é visitante, continua para tentar como usuário
        }
        
        // Se não encontrou mensagens de visitante, buscar como usuário
        if (!isVisitorConversation) {
          const [userMessages, userName] = await Promise.all([
            supabaseMessages.getMessagesBetweenUsers(String(senderId), String(activeBrokerId)),
            fetchUserName(activeBrokerId)
          ]);
          messages = userMessages;
          userInfo = userName;
        }

        setConversations((prevConversations) => {
          const existingIndex = prevConversations.findIndex(
            (conv) => conv.userId === activeBrokerId || conv.visitorId === activeBrokerId
          );

          const updatedConversation: Conversation = {
            userId: isVisitorConversation ? undefined : activeBrokerId,
            visitorId: isVisitorConversation ? activeBrokerId : undefined,
            userName: userInfo || "Desconhecido",
            userPhone: isVisitorConversation ? messages[0]?.visitor_sender?.phone : undefined,
            isVisitor: isVisitorConversation,
            messages: messages,
            unreadCount: 0
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
      // Verificar se é uma conversa com visitante
      const currentConversation = conversations.find(conv => 
        conv.mainId === activeBrokerId || conv.userId === activeBrokerId || conv.visitorId === activeBrokerId
      );

      if (currentConversation?.isVisitor) {
        // Não é possível enviar mensagem para visitante (visitante não tem conta)
        alert('Não é possível enviar mensagem para visitantes. Eles devem entrar em contato através do formulário.');
        return;
      }

      // Usar supabaseMessages para enviar mensagem
      await supabaseMessages.sendMessage({
        sender_id: String(senderId),
        receiver_id: activeBrokerId,
        content: newMessage,
      });

      // Buscar mensagens atualizadas
      const messages = await supabaseMessages.getMessagesBetweenUsers(
        String(senderId), 
        String(activeBrokerId)
      );

      setConversations((prevConversations) => {
        const existingIndex = prevConversations.findIndex((conv) => conv.userId === activeBrokerId);

        const updatedConversation: Conversation = {
          userId: activeBrokerId,
          userName: conversations.find((conv) => conv.userId === activeBrokerId || conv.visitorId === activeBrokerId)?.userName || "Desconhecido",
          isVisitor: false,
          unreadCount: 0,
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

  const handleSelectBroker = async (id: string) => {
    setActiveBrokerId(id);
    navigate(`/messages/${id}`);
    
    // Marcar mensagens como lidas quando selecionar a conversa
    try {
      if (senderId) {
        // Encontrar a conversa para saber se é visitante ou usuário
        const conversation = conversations.find(conv => 
          conv.userId === id || conv.visitorId === id || conv.mainId === id
        );

        if (conversation?.isVisitor) {
          // Se é visitante, usar a função específica para visitantes
          console.log("📱 Marcando mensagens de visitante como lidas:", id, senderId);
          await supabaseVisitors.markVisitorMessagesAsRead(id, String(senderId));
        } else {
          // Se é usuário, usar a função normal
          console.log("📱 Marcando mensagens de usuário como lidas:", senderId, id);
          await supabaseMessages.markMessagesAsRead(String(senderId), id);
        }
        
        // Atualizar o contador de mensagens não lidas
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv.userId === id || conv.visitorId === id || conv.mainId === id
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      }
    } catch (error) {
      console.error("Erro ao marcar mensagens como lidas:", error);
    }
  };

  const handleDeleteConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Impedir que o clique abra a conversa
    
    const confirmDelete = window.confirm("Tem certeza que deseja excluir esta conversa? Todas as mensagens serão apagadas permanentemente.");
    if (!confirmDelete) return;

    try {
      // Encontrar a conversa para saber se é visitante ou usuário
      const conversation = conversations.find(conv => 
        conv.userId === conversationId || conv.visitorId === conversationId
      );

      if (!conversation) {
        alert("Conversa não encontrada.");
        return;
      }

      // Deletar mensagens do banco de dados
      await supabaseDeleteMessages.deleteConversation(
        String(senderId),
        conversationId,
        conversation.isVisitor
      );

      // Remover a conversa do estado local
      setConversations(prevConversations => 
        prevConversations.filter(conv => 
          (conv.userId !== conversationId && conv.visitorId !== conversationId)
        )
      );

      // Se a conversa excluída estava ativa, limpar a seleção
      if (activeBrokerId === conversationId) {
        setActiveBrokerId("");
        navigate("/messages");
      }

      alert("Conversa excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir conversa:", error);
      alert("Erro ao excluir conversa. Tente novamente.");
    }
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

      <ResponsiveWrapper>
        <MainContentArea>
        <ContactList>
          {conversations.map((conversation, index) => (
            <ContactItem
              key={`${conversation.mainId || conversation.userId || conversation.visitorId}-${index}`} 
              onClick={() => handleSelectBroker(conversation.mainId || conversation.userId || conversation.visitorId || '')}
              className={activeBrokerId === (conversation.mainId || conversation.userId || conversation.visitorId) ? 'active' : ''}
            >
              <DeleteButton
                onClick={(e) => handleDeleteConversation(conversation.mainId || conversation.userId || conversation.visitorId || '', e)}
                title="Excluir conversa"
              >
                <Trash2 size={12} />
              </DeleteButton>
              
              {conversation.unreadCount > 0 && (
                <UnreadIndicator>
                  {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                </UnreadIndicator>
              )}
              
              <ContactName>
                <strong>{conversation.userName || "Desconhecido"}</strong>
              </ContactName>
            </ContactItem>
          ))}
        </ContactList>

        <MessagesArea>
          {activeBrokerId && (
            <>
              <ConversationHeader>
                Conversando com{" "}
                {conversations.find((conv) => conv.userId === activeBrokerId || conv.visitorId === activeBrokerId)?.userName || "Desconhecido"}
              </ConversationHeader>
              <MessageList>
                {conversations
                  .find((conv) => conv.userId === activeBrokerId || conv.visitorId === activeBrokerId)
                  ?.messages?.length ? (
                  conversations
                    .find((conv) => conv.userId === activeBrokerId || conv.visitorId === activeBrokerId)
                    ?.messages.map((message, index) => {
                      const messageKey = `${activeBrokerId}-${message.id}-${index}`; 
                      const isFromCurrentUser = message.sender_id === String(senderId);
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

              <MessageInputContainer>
                <MessageInput
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                />
                <SendButton onClick={handleSendMessage}>Enviar</SendButton>
              </MessageInputContainer>
            </>
          )}
        </MessagesArea>
        </MainContentArea>
      </ResponsiveWrapper>
    </MessageContainer>
  );
};

export default Messages;