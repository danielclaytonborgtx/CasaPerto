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
        Imóveis incríveis perto de você com facilidade e rapidez. 
        Nossa plataforma conecta você às melhores opções disponíveis por perto, tornando 
        sua busca simples e eficiente. Acima no cabeçalho temos tres opções, o menu a esquerda onde é possivel fazer o login, após logado você terá acesso ao seu perfil, onde verá os seus imóveis já postados. No meio, tem o botão que muda de venda para aluguel, somente para vizualizar no mapa ou na lista.
        a direita no + é possivel postar o imóvel, somente se estiver logado. 
        abaixo temos um rodapé, onde tem as opções de mapa e de lista.
        Qualquer falha que houver, tente atualizar a página possivelmente resolverá.
      </Description>
    </Container>
  );
};

export default Home;
