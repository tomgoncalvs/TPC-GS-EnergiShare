import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import axios from 'axios';

const Login: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      // Fazendo a chamada para a API de autenticação
      const response = await axios.post('http://localhost:8080/login', {
        email,
        password,
      });

      const token = response.data.token;

      // Salvando o token no localStorage
      localStorage.setItem('authToken', token);

      // Redirecionando para a página inicial ou protegida
      window.location.href = '/dashboard';
    } catch (error: any) {
      // Exibindo mensagem de erro
      setErrorMessage(
        error.response?.data?.message || 'Erro ao autenticar. Tente novamente.'
      );
    }
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#121212',
        color: '#FFFFFF',
      }}
    >
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={handleSignIn}
        sx={{
          mt: 2,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <TextField
          name="email"
          label="E-mail"
          variant="outlined"
          fullWidth
          InputProps={{
            style: { color: '#FFFFFF' },
          }}
          InputLabelProps={{
            style: { color: '#B3B3B3' },
          }}
        />
        <TextField
          name="password"
          type="password"
          label="Senha"
          variant="outlined"
          fullWidth
          InputProps={{
            style: { color: '#FFFFFF' },
          }}
          InputLabelProps={{
            style: { color: '#B3B3B3' },
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: '#BB86FC',
            '&:hover': { backgroundColor: '#9c67f5' },
          }}
        >
          Entrar
        </Button>
      </Box>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Link href="#" variant="body2" color="secondary">
          Esqueceu sua senha?
        </Link>
        <Link href="#" variant="body2" color="secondary">
          Registrar-se
        </Link>
      </Box>
    </Container>
  );
};

export default Login;
