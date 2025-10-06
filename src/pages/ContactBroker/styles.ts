import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  padding-top: 80px; /* Espaço para o header fixo */
  padding-bottom: 100px; /* Espaço para o footer fixo */
  box-sizing: border-box;
`;

export const Header = styled.div`
  max-width: 800px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
`;


export const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 30px;
  margin-bottom: 50px; /* Espaço extra no final para evitar sobreposição com footer */
`;

export const BrokerInfo = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 24px;
  border: 1px solid #e2e8f0;
`;

export const BrokerAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
`;

export const BrokerDetails = styled.div`
  flex: 1;
`;

export const BrokerName = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
`;

export const BrokerEmail = styled.span`
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

export const BrokerPhone = styled.span`
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

// Responsividade
export const ResponsiveWrapper = styled.div`
  @media (max-width: 768px) {
    ${Container} {
      padding: 15px;
    }

    ${Header} {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }

    ${BrokerInfo} {
      flex-direction: column;
      text-align: center;
      gap: 20px;
    }

    ${BrokerAvatar} {
      width: 100px;
      height: 100px;
    }
  }
`;
