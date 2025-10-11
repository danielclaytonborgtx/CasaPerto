import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  margin-top: 70px;
  margin-bottom: 80px;
  width: 100%;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;

  h2 {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 2em;
    font-weight: 700;
    background: linear-gradient(135deg, #007bff 0%, #00BFFF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin: 30px 0;
    letter-spacing: 0.5px;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #00BFFF 0%, #007bff 100%);
      border-radius: 2px;
    }

    @media (max-width: 768px) {
      font-size: 1.5em;
      margin: 20px 0;
    }
  }

  @media (max-width: 768px) {
    padding: 30px 16px;
    margin-top: 60px;
  }
`;

export const Input = styled.input`
  font-family: 'Poppins', sans-serif;
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1em;
  color: #2d3748;
  background: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 4px rgba(0, 123, 255, 0.1);
  }

  &::placeholder {
    color: #a0aec0;
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    font-size: 0.95em;
  }
`;

export const Button = styled.button`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  color: #fff;
  border: none;
  padding: 16px 48px;
  font-size: 1.1em;
  font-weight: 600;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.3);
  margin-top: 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 123, 255, 0.4);
    
    &::before {
      opacity: 1;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 14px 36px;
    font-size: 1em;
    margin-top: 30px;
  }
`;

export const BrokerList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 16px;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }

  @media (max-width: 768px) {
    max-height: 300px;
  }
`;

export const BrokerItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 14px 18px;
  margin: 8px 0;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  font-family: 'Poppins', sans-serif;
  font-size: 0.95em;
  color: #2d3748;
  font-weight: 500;

  &:hover {
    transform: translateX(4px);
    border-color: #00BFFF;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.15);
  }

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 0.9em;
  }
`;

export const AddedBrokerList = styled.ul`
  list-style: none;
  padding: 12px;
  margin-top: 16px;
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  background: linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 123, 255, 0.1);
  border: 2px solid rgba(0, 191, 255, 0.2);

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 123, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 123, 255, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(0, 123, 255, 0.5);
    }
  }

  @media (max-width: 768px) {
    max-height: 300px;
  }
`;

export const TeamIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 140px;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
  border: 4px solid #fff;

  &::before {
    content: '';
    position: absolute;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
    opacity: 0.1;
    z-index: -1;
  }

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 123, 255, 0.4);
  }

  button {
    background: none;
    border: none;
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  span {
    font-size: 48px;
    color: #fff;
    font-weight: 300;
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;

    &::before {
      width: 130px;
      height: 130px;
    }

    span {
      font-size: 42px;
    }
  }
`;

export const TeamImage = styled.img`
  border-radius: 50%;
  width: 140px;
  height: 140px;
  object-fit: cover;
  margin-bottom: 20px;
  border: 4px solid #fff;
  box-shadow: 0 8px 24px rgba(0, 123, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 12px 32px rgba(0, 123, 255, 0.4);
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }
`;

export const ListsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
  width: 100%;
  max-width: 1100px;
  margin-top: 40px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    margin-top: 30px;
  }
`;

export const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
  text-align: left;
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #00BFFF 0%, #007bff 100%);
  }

  h3 {
    font-family: 'Inter', sans-serif;
    font-size: 1.3em;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 20px 0;
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;

    h3 {
      font-size: 1.15em;
      margin-bottom: 16px;
    }
  }
`;

export const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 48%;
  text-align: left;
  background: #fff;
  padding: 24px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  }

  h3 {
    font-family: 'Inter', sans-serif;
    font-size: 1.3em;
    font-weight: 600;
    color: #2d3748;
    margin: 0 0 20px 0;
    letter-spacing: 0.3px;
  }

  @media (max-width: 768px) {
    width: 100%;
    padding: 20px;

    h3 {
      font-size: 1.15em;
      margin-bottom: 16px;
    }
  }
`;

export const AddBrokerButton = styled.button`
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  color: white;
  border: none;
  padding: 10px;
  font-size: 14px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.3);

  &:hover {
    transform: scale(1.1) rotate(90deg);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    font-size: 16px;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;

    svg {
      font-size: 14px;
    }
  }
`;
