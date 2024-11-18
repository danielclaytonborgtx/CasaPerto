import React from "react";
import { Container, Image, Title, Description } from "./styles";

const Home: React.FC = () => {
  return (
    <Container>
      <Image 
        src="https://deborahcorretora.com.br/wp-content/uploads/2020/04/google_maps_v2.jpg" 
        alt="Imagem representativa de imóveis próximos" 
      />
      <Title>Bem-vindo ao CasaPerto</Title>
      <Description>
        Descubra imóveis incríveis perto de você com facilidade e rapidez. 
        Nossa plataforma conecta você às melhores opções disponíveis, tornando 
        sua busca simples e eficiente.
      </Description>
    </Container>
  );
};

export default Home;
