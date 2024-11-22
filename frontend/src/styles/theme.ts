import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#BB86FC', // Roxo principal
    },
    secondary: {
      main: '#03DAC6', // Verde claro
    },
    background: {
      default: '#121212', // Preto profundo
      paper: '#1E1E1E',   // Preto mais claro para cartões
    },
    text: {
      primary: '#FFFFFF', // Texto principal em branco
      secondary: '#B3B3B3', // Texto secundário em cinza claro
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
