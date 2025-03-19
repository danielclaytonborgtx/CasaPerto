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
      Descubra os Melhores Imóveis Perto de Você!
      Nossa aplicação foi desenvolvida para facilitar a busca por imóveis de forma rápida e intuitiva. 
      Na opção de Lista, você pode ver todos os imóveis disponíveis, organizados por proximidade.
      Com apenas alguns toques, você pode visualizar as melhores opções disponíveis ao seu redor, garantindo praticidade na hora de encontrar o imóvel ideal.
      Para corretores, a plataforma funciona como um CRM completo, permitindo o cadastro e a organização de imóveis com todas as informações essenciais, 
      incluindo características detalhadas, imagens, contatos e localização exata. Assim, 
      você gerencia seu portfólio de maneira eficiente e nunca perde uma oportunidade de negócio.
      Aproveite a experiência de encontrar e gerenciar imóveis de forma simples e inteligente!
      </Description>
    </Container>
  );
};

export default Home;
