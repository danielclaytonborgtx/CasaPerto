import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 1px;
  background: linear-gradient(135deg, #00BFFF 0%, #007bff 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 40px;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
`;

export const MenuButton = styled.button`
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 45px; 
  width: 45px; 
  margin-right: 15px;
  margin-top: 8px;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2); 
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const AddButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  cursor: pointer;
  height: 45px;
  width: 45px;  
  margin-left: 15px;
  margin-top: 8px;
  border-radius: 50%; 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }
`;

export const Icon = styled.span`
  font-size: 25px;
  color: black;
`;

export const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0, 191, 255, 0.3);
  padding: 1.5px;
  border-radius: 20px;
  background: #4169E1;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.25);
  position: relative;
  z-index: 1;
  overflow: visible;
`;

export const SwitchLabel = styled.span<{ $position: 'left' | 'right' }>`
  font-size: 20px;
  color: #1a1a1a;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 110%;
  width: 100%;
  position: absolute;
  ${({ $position }) => $position === 'left' ? 'left: -58px;' : 'right: -56px;'}
  top: 2px;
  text-align: center;
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
`;

export const ModernSwitch = styled.div`
  cursor: pointer;
  user-select: none;
`;

export const SwitchTrack = styled.div<{ $isActive: boolean }>`
  position: relative;
  width: 160px;
  height: 28px;
  background: linear-gradient(90deg, #00BFFF 0%, rgb(139, 185, 234) 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
    border-radius: 14px;
  }
`;

export const SwitchText = styled.span<{ $isActive: boolean }>`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
  position: absolute;
  opacity: ${({ $isActive }) => $isActive ? 1 : 0};
  transform: ${({ $isActive }) => $isActive ? 'scale(1)' : 'scale(0.8)'};
`;

export const SwitchThumb = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: -1px;
  left: ${({ $isActive }) => $isActive ? 'calc(100% - 30px)' : '0px'};
  width: 30px;
  height: 30px;
  background: #FFD54F;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 26px;
    height: 26px;
    background: #002B80;
    border-radius: 50%;
  }
`;





