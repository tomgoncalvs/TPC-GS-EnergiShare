import styled from 'styled-components';

export const Input = styled.input`
  padding: 10px;
  background-color: #1F1F1F; /* Preto mais claro */
  color: #FFFFFF;
  border: 1px solid #333333;
  border-radius: 5px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #555555;
  }
`;
