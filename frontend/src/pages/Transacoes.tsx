import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress } from '@mui/material';

const Transacoes: React.FC = () => {
  const [transacoes, setTransacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  };

  useEffect(() => {
    const fetchTransacoes = async () => {
      try {
        const response = await fetch('http://localhost:8080/transacoes', {
          method: 'GET',
          headers: getHeaders(),
        });

        if (!response.ok) {
          throw new Error(`Erro: ${response.status}`);
        }

        const data = await response.json();
        setTransacoes(data.content || []);
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
        alert('Não foi possível carregar as transações. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransacoes();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#121212',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2, backgroundColor: '#121212', color: '#FFFFFF' }}>
      {transacoes.map((transacao, index) => (
        <Card
          key={index}
          sx={{ backgroundColor: '#1E1E1E', color: '#FFFFFF', marginBottom: 3 }}
        >
          <CardContent>
            <Typography variant="h6">{transacao.tipo}</Typography>
            <Typography>
              <strong>Quantidade:</strong> {transacao.quantidade} kWh
            </Typography>
            <Typography>
              <strong>Valor Total:</strong> R$ {transacao.valorTotal.toFixed(2)}
            </Typography>
            <Typography>
              <strong>Data:</strong> {transacao.dataTransacao}
            </Typography>
            <Typography>
              <strong>Hash Blockchain:</strong> {transacao.blockchainHash}
            </Typography>
            <Typography>
              <strong>Status Blockchain:</strong>{' '}
              {transacao.statusBlockchain || 'Indisponível'}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default Transacoes;
