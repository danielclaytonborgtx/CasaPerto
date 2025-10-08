// Sistema de Tipografia Profissional para Plataforma de Imóveis
export const typography = {
  // Fonte Principal - Para títulos, headers e elementos importantes
  primary: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    }
  },
  
  // Fonte Secundária - Para textos, descrições e conteúdo
  secondary: {
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    }
  },
  
  // Tamanhos de fonte padronizados
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px'
  },
  
  // Line heights para diferentes tamanhos
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75
  },
  
  // Letter spacing para diferentes contextos
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em'
  }
};

// Aplicar fontes globalmente
export const applyGlobalFonts = () => {
  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Poppins:wght@300;400;500;600;700&display=swap');
    
    * {
      font-family: ${typography.secondary.fontFamily};
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: ${typography.primary.fontFamily};
      font-weight: ${typography.primary.weights.semibold};
    }
    
    button, .btn {
      font-family: ${typography.primary.fontFamily};
      font-weight: ${typography.primary.weights.medium};
    }
  `;
  document.head.appendChild(style);
};
