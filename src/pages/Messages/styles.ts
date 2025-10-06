// src/app/Messages/styles.ts
import styled from "styled-components";

export const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 60px;
  padding-bottom: 100px;
`;

export const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const ContactList = styled.div`
  width: 200px;
  padding-right: 5px;
  margin-right: 10px;
  border-right: 1px solid #ccc;
`;

export const ContactItem = styled.div`
  padding: 5px;
  cursor: pointer;
  position: relative;
  &:hover {
    background-color: #f0f0f0;
  }
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #fc8181;
  color: white;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  padding: 0;
  opacity: 0;
  transition: all 0.2s ease;
  z-index: 10;

  ${ContactItem}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: #f56565;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const MessageList = styled.ul`
  list-style: none;
  padding: 0;
  height: 430px;
  overflow-y: auto;
`;

export const MessageItem = styled.li`
  background: #f1f1f1;
  padding: 10px;
  margin: 5px 0;
  border-radius: 8px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
  width: calc(100% - 22px);
  
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
`;

export const MessageInput = styled.input`
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  font-size: 16px;
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
