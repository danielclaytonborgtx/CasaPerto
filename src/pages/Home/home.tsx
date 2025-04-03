import React from "react";
import { Container, Image, Title, Description } from "./styles";

const Home: React.FC = () => {
  return (
    <Container>
      <Image 
        src="https://deborahcorretora.com.br/wp-content/uploads/2020/04/google_maps_v2.jpg" 
        alt="Imagem representativa de imóveis próximos" 
      />
      <Title>Bem-vindo ao Casa Perto</Title>
      <Description>
        Encontre os Melhores Imóveis Perto de Você!
        Nossa aplicação foi criada para tornar a busca por imóveis mais rápida, intuitiva e eficiente.
        Na aba Lista, você pode explorar todos os imóveis disponíveis, organizados por proximidade, 
         facilitando a escolha do lugar ideal com apenas alguns toques.
        Para <strong>Corretores,</strong> a plataforma funciona como um <strong> CRM </strong> completo, permitindo o cadastro e a gestão de imóveis com todas as informações essenciais, 
         incluindo características detalhadas, imagens, contatos e localização exata. Dessa forma, 
         você organiza seu portfólio com eficiência e nunca perde uma oportunidade de negócio.
        Aproveite uma experiência inteligente e simplificada para encontrar e gerenciar imóveis com praticidade!
      </Description>
    </Container>
  );
};

export default Home;
