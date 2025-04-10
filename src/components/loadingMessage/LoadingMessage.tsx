import React from 'react';
import { Container, Message, Spinner } from './styles';

const LoadingMessage: React.FC = () => {
  return (
    <Container>
      <Spinner />
      <Message>Carregando...</Message>
    </Container>
  );
};

export default LoadingMessage;
