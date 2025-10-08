// src/app/Messages/styles.ts
import styled from "styled-components";

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  margin-top: 60px;
  padding-bottom: 200px;
  min-height: calc(100vh - 160px);
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ContactList = styled.div`
  width: 300px;
  min-width: 280px;
  padding-right: 10px;
  margin-right: 15px;
  border-right: 1px solid #e2e8f0;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 10px;
`;

export const ContactItem = styled.div`
  padding: 12px 8px;
  cursor: pointer;
  position: relative;
  border-radius: 6px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
  background-color: transparent;
  border-left: none;
  
  &:hover {
    background-color: #e2e8f0;
    transform: translateX(2px);
  }
  
  &:active {
    background-color: #cbd5e1;
  }
  
  &.active {
    background-color: #dbeafe;
    border-left: 4px solid #3b82f6;
    font-weight: bold;
  }
`;

export const UnreadIndicator = styled.div`
  position: absolute;
  top: 8px;
  left: 8px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  z-index: 5;
`;

export const ContactName = styled.div`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  margin-left: 28px;
  font-weight: 500;
  letter-spacing: 0.2px;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  padding: 0;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  ${ContactItem}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #dc2626;
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: scale(0.95);
    background-color: #b91c1c;
  }
`;

export const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  height: 430px;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
`;

export const MessageItem = styled.li`
  background: #f1f1f1;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  word-wrap: break-word;
  overflow-wrap: break-word;
  
  & strong {
    display: block;
    font-size: 14px;
    font-weight: bold;
  }

  & small {
    display: block;
    font-size: 12px;
    color: gray;
  }
  
  & p {
    margin: 5px 0;
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
`;

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #00BFFF;
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background-color: #87CEEB;
  }
`;

export const MainContentArea = styled.div`
  display: flex;
  flex: 1;
  gap: 15px;
  min-height: 500px;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const MessagesArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
`;

export const ConversationHeader = styled.h3`
  margin: 0 0 15px 0;
  padding: 10px 0;
  border-bottom: 1px solid #e2e8f0;
  color: #1e293b;
  font-size: 18px;
`;

export const MessageInputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
  margin-bottom: 20px;
  padding: 15px 10px 20px 10px;
  border-top: 1px solid #e2e8f0;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const MessageInput = styled.input`
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 16px;
  transition: border-color 0.2s ease;
  min-width: 0;
  width: 100%;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

export const SendButton = styled.button`
  padding: 12px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;
  min-width: 80px;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:active {
    background-color: #1d4ed8;
  }
`;

// Media queries para responsividade
export const ResponsiveWrapper = styled.div`
  @media (max-width: 768px) {
    ${MainContentArea} {
      flex-direction: column;
      gap: 10px;
    }
    
    ${ContactList} {
      width: 100%;
      min-width: auto;
      max-height: 200px;
      overflow-y: auto;
      margin-right: 0;
      border-right: none;
      border-bottom: 1px solid #e2e8f0;
    }
    
    ${MessagesArea} {
      min-height: 400px;
    }
    
    ${MessageContainer} {
      padding-bottom: 220px;
    }
    
    ${MessageInputContainer} {
      margin-bottom: 25px;
      padding: 15px 8px 25px 8px;
      gap: 8px;
    }
    
    ${SendButton} {
      padding: 12px 18px;
      min-width: 75px;
    }
    
    ${UnreadIndicator} {
      width: 18px;
      height: 18px;
      font-size: 11px;
    }
    
    ${ContactName} {
      margin-left: 26px;
    }
  }
  
  @media (max-width: 480px) {
    ${MessageContainer} {
      padding: 10px;
      padding-bottom: 250px;
    }
    
    ${ContactList} {
      padding: 8px;
    }
    
    ${ContactItem} {
      padding: 8px 6px;
    }
    
    ${DeleteButton} {
      width: 20px;
      height: 20px;
      top: 6px;
      right: 6px;
    }
    
    ${MessageInputContainer} {
      margin-bottom: 30px;
      padding: 15px 5px 30px 5px;
      gap: 8px;
    }
    
    ${SendButton} {
      padding: 12px 16px;
      font-size: 14px;
      min-width: 70px;
    }
    
    ${MessageInput} {
      font-size: 14px;
      padding: 10px;
    }
    
    ${UnreadIndicator} {
      width: 16px;
      height: 16px;
      font-size: 10px;
      top: 6px;
      left: 6px;
    }
    
    ${ContactName} {
      margin-left: 24px;
    }
  }
`;
