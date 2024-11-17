import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f9;
    color: #333;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  /* Adicionando ajustes responsivos */
  @media (max-width: 360px) {
    body {
      padding: 10px;  /* Ajuste de padding para telas menores */
    }

    #root {
      max-width: 360px;  /* Limite de largura do container */
      margin: 0 auto;  /* Centraliza na tela */
      overflow: hidden;  /* Evita que o conteúdo ultrapasse */
    }
  }

  @media (max-width: 740px) {
    #root {
      max-height: 740px;  /* Limite de altura do container */
    }
  }
`;

export default GlobalStyles;
