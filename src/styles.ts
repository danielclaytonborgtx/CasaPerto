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

  .gm-style-iw {
    padding: 0 !important;
    overflow: hidden !important;
  }

  .gm-style-iw-d {
    overflow: hidden !important;
    padding: 0 !important;
    background: none !important;
  }

  .gm-style-iw-c {
  padding: 0 !important; 
  margin: 0 !important;  
  background: none !important; 
  border-radius: 8px !important; 
  overflow: hidden !important;
  box-shadow: 0 20px 18px rgba(0, 0, 0, 0.5) !important; 
  }

  .gm-style-iw-t::after {
    display: none !important;
  }

  .gm-ui-hover-effect {
    display: none !important;
  }

  @media (max-width: 360px) {
    body {
      padding: 10px;
    }

    #root {
      max-width: 360px;
      margin: 0 auto;
      overflow: hidden;
    }
  }

  @media (max-width: 740px) {
    #root {
      max-height: 740px;
    }
  }
`;

export default GlobalStyles;
