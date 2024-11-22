import styled from 'styled-components';

export const Button = styled.button`
  padding: 10px 20px;
  background-color: #1F1F1F; /* Preto um pouco mais claro */
  color: #FFFFFF;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #333333; /* Realce ao passar o mouse */
  }
`;
