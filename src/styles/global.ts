import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: #333;
    background-color: #f8fafc;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 600;
    line-height: 1.2;
    letter-spacing: 0.3px;
  }
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: 0.5px;
  }
  
  h2 {
    font-size: 2rem;
    font-weight: 600;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  h4 {
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  h5 {
    font-size: 1.125rem;
    font-weight: 600;
  }
  
  h6 {
    font-size: 1rem;
    font-weight: 600;
  }
  
  p {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.7;
    color: #4a5568;
  }
  
  button {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-weight: 500;
    letter-spacing: 0.2px;
  }
  
  input, textarea, select {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  a {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-decoration: none;
    color: inherit;
  }
  
  strong, b {
    font-weight: 600;
  }
  
  em, i {
    font-style: italic;
  }
  
  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  
  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  }
  
  /* Focus styles para acessibilidade */
  *:focus {
    outline: 2px solid #00BFFF;
    outline-offset: 2px;
  }
  
  /* Seleção de texto */
  ::selection {
    background: rgba(0, 191, 255, 0.2);
    color: #1a1a1a;
  }
  
  /* Responsividade para fontes */
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    h2 {
      font-size: 1.75rem;
    }
    
    h3 {
      font-size: 1.25rem;
    }
    
    body {
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    h1 {
      font-size: 1.75rem;
    }
    
    h2 {
      font-size: 1.5rem;
    }
    
    h3 {
      font-size: 1.125rem;
    }
    
    body {
      font-size: 13px;
    }
  }
`;
