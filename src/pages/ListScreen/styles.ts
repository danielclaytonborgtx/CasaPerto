import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  margin-top: 60px;
  margin-bottom: 50px;
  width: 100%;
  box-sizing: border-box;
`;

export const SearchInput = styled.input`
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  width: 95%;
  max-width: 400px;
  padding: 8px 10px;
  margin-bottom: 20px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  transition: all 0.3s ease;
  letter-spacing: 0.2px;

  &:focus {
    outline: none;
    border-color: #00BFFF;
    box-shadow: 0 0 0 2px rgba(0, 191, 255, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 16px;
    border-radius: 6px;
  }
`;

export const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  max-width: 1200px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 16px;
    border-radius: 6px;
  }
`;

export const Image = styled.img`
  width: 100%; 
  height: 250px; 
  object-fit: cover; 
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  @media (max-width: 768px) {
    height: 200px;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }
`;

export const Title = styled.h3`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 18px;
  font-weight: 600;
  margin: 10px;
  text-align: center;
  color: #2d3748;
  letter-spacing: 0.2px;

  @media (max-width: 768px) {
    font-size: 16px;
    margin: 8px;
  }
`;

export const Price = styled.p`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: #059669; 
  font-size: 1.2em;
  font-weight: 700;
  margin-top: 5px;
  text-align: center;
  letter-spacing: 0.3px;

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;

export const Button = styled.button`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  color: white;
  border: none;
  padding: 8px;
  width: 100%;
  text-align: center;
  cursor: pointer;
  border-radius: 0 0 8px 8px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  letter-spacing: 0.2px;

  &:hover {
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 15px;
    border-radius: 0 0 6px 6px;
  }
`;
