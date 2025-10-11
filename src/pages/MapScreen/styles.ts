import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh; 
  margin-top: 40px; 
  margin-bottom: 40px;
  padding: 0; 

  .map-container {
    flex-grow: 1;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    box-sizing: border-box; 
  }
`;

export const UpdateButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 10px;
  background-color: white;
  color: black;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  font-size: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 60px;
`;

export const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
`;

export const LoginMessage = styled.div`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 20px;
  padding: 32px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  max-width: 600px;
  width: 90%;
  text-align: center;
  border: 2px solid rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(10px);

  h2 {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 1.8em;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 20px 0;
    letter-spacing: 0.3px;
  }

  .properties-count {
    font-family: 'Poppins', sans-serif;
    font-size: 1.2em;
    color: #475569;
    margin: 0 0 16px 0;
    line-height: 1.6;

    strong {
      color: #3b82f6;
      font-size: 1.3em;
      font-weight: 700;
    }
  }

  .info-text {
    font-family: 'Poppins', sans-serif;
    font-size: 1em;
    color: #64748b;
    margin: 0 0 24px 0;
    line-height: 1.6;
  }

  .register-button {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border: none;
    padding: 16px 40px;
    font-size: 1.1em;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }

    &:active {
      transform: translateY(-1px);
    }
  }

  @media (max-width: 768px) {
    top: 70px;
    padding: 24px 20px;
    max-width: 90%;

    h2 {
      font-size: 1.4em;
      margin-bottom: 16px;
    }

    .properties-count {
      font-size: 1em;

      strong {
        font-size: 1.2em;
      }
    }

    .info-text {
      font-size: 0.9em;
      margin-bottom: 20px;
    }

    .register-button {
      padding: 14px 32px;
      font-size: 1em;
    }
  }
`;


