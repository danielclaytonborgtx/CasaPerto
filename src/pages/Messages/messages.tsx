import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/authContext"; 
import api from "../../services/api";
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
  sender: string;
  content: string;
  timestamp: string;
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
        const response = await api.get(`/messages/conversations/${senderId}`);

        const conversationsWithNames = await Promise.all(
          response.data.map(async (conv: { userId: string; messages: Message[] }) => {
            try {
              const brokerResponse = await api.get(`/users/${conv.userId}`);
              return {
                userId: conv.userId,
                userName: brokerResponse.data.name,
                messages: conv.messages || [],
              };
            } catch (error) {
              console.error("Erro ao buscar nome do corretor", error);
              return { ...conv, userName: "Desconhecido", messages: [] };
            }
          })
        );

        setConversations(conversationsWithNames);
      } catch (error) {
        console.error("Erro ao carregar conversas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [senderId]);

  useEffect(() => {
    if (!senderId || !activeBrokerId) return;

    const fetchConversation = async () => {
      try {
        const brokerIdNum = parseInt(activeBrokerId, 10);

        const [messagesResponse, brokerResponse] = await Promise.all([
          api.get("/messages", { params: { senderId, receiverId: brokerIdNum } }),
          api.get(`/users/${brokerIdNum}`),
        ]);

        setConversations((prevConversations) => {
       
          const existingIndex = prevConversations.findIndex(
            (conv) => conv.userId === activeBrokerId
          );

          const updatedConversation: Conversation = {
            userId: activeBrokerId,
            userName: brokerResponse.data.name,
            messages: messagesResponse.data,
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
        console.error("Erro ao buscar mensagens", error);
      }
    };

    fetchConversation();
    const intervalId = setInterval(fetchConversation, 3000);

    return () => clearInterval(intervalId);
  }, [activeBrokerId, senderId]);

  useEffect(() => {
    const now = new Date().toISOString();
    localStorage.setItem("lastSeenMessages", now);
  }, []);
  

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeBrokerId) return;

    try {
      await api.post("/messages", {
        senderId,
        receiverId: parseInt(activeBrokerId, 10),
        content: newMessage,
      });

      const response = await api.get("/messages", {
        params: { senderId, receiverId: parseInt(activeBrokerId, 10) },
      });

      setConversations((prevConversations) => {
        const existingIndex = prevConversations.findIndex((conv) => conv.userId === activeBrokerId);

        const updatedConversation: Conversation = {
          userId: activeBrokerId,
          userName: conversations.find((conv) => conv.userId === activeBrokerId)?.userName || "Desconhecido",
          messages: response.data,
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
      console.error("Erro ao enviar a mensagem", error);
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
                  
                      return (
                        <MessageItem key={messageKey}>
                          <strong>{message.sender}</strong>
                          <p>{message.content}</p>
                          <small>{new Date(message.timestamp).toLocaleString()}</small>
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