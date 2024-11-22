import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

const StyledButton = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.text};
  padding: 10px 20px;
  border: none;
  cursor: pointer;
`;

const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return <StyledButton onClick={onClick}>{label}</StyledButton>;
};

export default Button;
