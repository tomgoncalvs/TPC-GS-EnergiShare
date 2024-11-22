import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  Alert,
} from '@mui/material';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Define o tipo da mensagem
type ChatMessage = {
  content: string;
  fromAi: boolean; // Indica se a mensagem é da IA
};

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [toAi, setToAi] = useState(false);
  const [connected, setConnected] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('Conectando...');
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const sockJsUrl = 'http://localhost:8080/ws';
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(sockJsUrl),
      connectHeaders: {
        login: 'guest',
        passcode: 'guest',
      },
      debug: (str) => {
        console.log('STOMP: ', str);
      },
      onConnect: () => {
        console.log('Conectado ao RabbitMQ');
        setConnected(true);
        setStatusMessage('Conectado ao servidor!');
        stompClient.subscribe('/topic/chat', (message) => {
          const content = message.body;
          console.log('Mensagem recebida:', content);

          // Verifica se a mensagem é da IA com base em `toAi` (ou outros indicadores)
          const isFromAi = content.startsWith('Olá') || content.includes('EnergiShare'); // Ajuste a lógica conforme necessário

          // Adiciona a mensagem recebida ao estado
          setMessages((prevMessages) => [
            ...prevMessages,
            { content, fromAi: isFromAi },
          ]);
        });
      },
      onStompError: (error) => {
        console.error('Erro no STOMP:', error);
        setStatusMessage('Erro no protocolo STOMP.');
      },
      onWebSocketError: (error) => {
        console.error('Erro no WebSocket:', error);
        setStatusMessage('Erro na conexão com WebSocket.');
      },
      onDisconnect: () => {
        console.log('Desconectado do RabbitMQ');
        setConnected(false);
        setStatusMessage('Desconectado do servidor.');
      },
      reconnectDelay: 5000,
    });

    stompClient.activate();
    setClient(stompClient);

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const handleSendMessage = () => {
    if (!client || !connected) {
      console.error('Cliente STOMP não está conectado.');
      setStatusMessage('Não é possível enviar mensagens: desconectado.');
      return;
    }

    const destination = toAi ? '/app/chat/ai' : '/app/chat/user';

    const messagePayload = {
      content: inputMessage, // Mensagem digitada
      toAi, // Booleano para identificar se é para a IA
    };

    // Adiciona a mensagem do usuário ao estado
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: inputMessage, fromAi: false },
    ]);

    client.publish({
      destination,
      body: JSON.stringify(messagePayload), // Certifique-se de enviar como JSON
    });

    setInputMessage('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
        padding: 3,
        backgroundColor: '#121212',
        color: '#FFFFFF',
      }}
    >
      <Typography variant="h4" mb={2}>
        Chat
      </Typography>

      {statusMessage && (
        <Alert severity={connected ? 'success' : 'error'} sx={{ mb: 2 }}>
          {statusMessage}
        </Alert>
      )}

      <List
        sx={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#1E1E1E',
          borderRadius: 2,
          padding: 2,
        }}
      >
        {messages.map((message, index) => (
          <ListItem
            key={index}
            sx={{
              justifyContent: message.fromAi ? 'flex-end' : 'flex-start',
              textAlign: message.fromAi ? 'right' : 'left',
            }}
          >
            <Box
              sx={{
                maxWidth: '60%',
                padding: 1.5,
                borderRadius: 2,
                backgroundColor: message.fromAi ? '#4CAF50' : '#2196F3',
                color: '#FFFFFF',
              }}
            >
              {message.content}
              {message.fromAi && (
                <Typography
                  variant="caption"
                  sx={{ display: 'block', marginTop: 1, color: '#E0E0E0' }}
                >
                  Respondido com IA
                </Typography>
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      <FormControlLabel
        control={
          <Checkbox
            checked={toAi}
            onChange={(e) => setToAi(e.target.checked)}
            sx={{ color: '#BB86FC' }}
          />
        }
        label="Falar com assistente virtual (IA)"
        sx={{ color: '#FFFFFF', marginBottom: 2 }}
      />

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          marginTop: 2,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Digite sua mensagem"
          InputProps={{
            style: { color: '#FFFFFF' },
          }}
          InputLabelProps={{
            style: { color: '#B3B3B3' },
          }}
          sx={{
            backgroundColor: '#1E1E1E',
            borderRadius: 2,
          }}
          disabled={!connected}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendMessage}
          disabled={!connected || !inputMessage.trim()}
          sx={{
            backgroundColor: connected ? '#BB86FC' : '#888888',
            '&:hover': { backgroundColor: connected ? '#9c67f5' : '#888888' },
          }}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default Chat;
