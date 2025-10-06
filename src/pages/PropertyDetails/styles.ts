import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
`;

export const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
`;

export const SliderContainer = styled.div`
  width: 100%;
  height: 500px;
  position: relative;
  background: #f8fafc;
  
  .slick-dots {
    bottom: 20px;
    z-index: 2;
    
    li button:before {
      color: white;
      font-size: 12px;
    }
    
    li.slick-active button:before {
      color: #3b82f6;
    }
  }
  
  .slick-prev,
  .slick-next {
    z-index: 2;
    width: 40px;
    height: 40px;
    
    &:before {
      font-size: 20px;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }
  
  .slick-prev {
    left: 20px;
  }
  
  .slick-next {
    right: 20px;
  }
`;

export const ImageWrapper = styled.div`
  width: 100%;
  height: 500px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.1));
    pointer-events: none;
  }
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: scale(1.05);
  }
`;

export const PropertyHeader = styled.div`
  padding: 40px 40px 20px;
  background: white;
  position: relative;
`;

export const Title = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  line-height: 1.2;
  text-align: left;
`;

export const Price = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #059669;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PropertyMeta = styled.div`
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

export const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f1f5f9;
  border-radius: 12px;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
`;

export const Description = styled.div`
  padding: 0 40px 40px;
  background: white;
`;

export const DescriptionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const DescriptionText = styled.p`
  font-size: 16px;
  line-height: 1.7;
  color: #475569;
  margin: 0;
  white-space: pre-line;
  text-align: left;
`;

export const FooterSection = styled.div`
  padding: 24px 40px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

export const FooterText = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
  
  strong {
    color: #1e293b;
    font-weight: 600;
  }
`;

export const ContactButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ImageCounter = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  z-index: 2;
`;

