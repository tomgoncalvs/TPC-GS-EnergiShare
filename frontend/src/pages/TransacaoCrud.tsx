import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

interface Transacao {
  id: number;
  tipoTransacao: string;
  quantidade: number;
  valorTotal: number;
  cliente: Cliente;
  energia: Energia;
  blockchainHash?: string;
  statusBlockchain: string;
}

interface Cliente {
  id: number;
  nome: string;
}

interface Energia {
  id: number;
  tipoEnergia: string;
}

const TransacaoCrud: React.FC = () => {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [energias, setEnergias] = useState<Energia[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<Partial<Transacao>>({});

  useEffect(() => {
    fetchTransacoes();
    fetchClientes();
    fetchEnergias();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    };
  };

  const fetchTransacoes = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:8080/clientes', {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      setClientes(data.content || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const fetchEnergias = async () => {
    try {
      const response = await fetch('http://localhost:8080/energia', {
        method: 'GET',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      setEnergias(data.content || []);
    } catch (error) {
      console.error('Erro ao carregar energias:', error);
    }
  };

  const handleSave = async () => {
    if (!form.tipoTransacao || !form.quantidade || !form.valorTotal || !form.cliente?.id || !form.energia?.id) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    const method = form.id ? 'PUT' : 'POST';
    const url = form.id
      ? `http://localhost:8080/transacoes/${form.id}`
      : 'http://localhost:8080/transacoes';

    const payload = {
      tipoTransacao: form.tipoTransacao,
      quantidade: form.quantidade,
      valorTotal: form.valorTotal,
      cliente: { id: form.cliente.id },
      energia: { id: form.energia.id },
      blockchainHash: form.blockchainHash,
      statusBlockchain: form.statusBlockchain || 'Pendente',
    };

    try {
      const response = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      fetchTransacoes();
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar transação:', error);
      alert('Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/transacoes/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      fetchTransacoes();
    } catch (error) {
      console.error('Erro ao deletar transação:', error);
    }
  };

  const handleOpen = (transacao?: Transacao) => {
    setForm(transacao || {});
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setForm({});
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Gerenciamento de Transações
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ marginBottom: 2 }}>
        Adicionar Nova Transação
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Quantidade</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Energia</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transacoes.map((transacao) => (
              <TableRow key={transacao.id}>
                <TableCell>{transacao.tipoTransacao}</TableCell>
                <TableCell>{transacao.quantidade}</TableCell>
                <TableCell>{transacao.valorTotal}</TableCell>
                <TableCell>{transacao.cliente?.nome || 'Desconhecido'}</TableCell>
                <TableCell>{transacao.energia?.tipoEnergia || 'Desconhecido'}</TableCell>
                <TableCell>{transacao.statusBlockchain}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(transacao)}>
                    Editar
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(transacao.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{form.id ? 'Editar Transação' : 'Adicionar Nova Transação'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tipo de Transação"
            fullWidth
            value={form.tipoTransacao || ''}
            onChange={(e) => setForm({ ...form, tipoTransacao: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantidade"
            type="number"
            fullWidth
            value={form.quantidade || ''}
            onChange={(e) => setForm({ ...form, quantidade: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Valor Total"
            type="number"
            fullWidth
            value={form.valorTotal || ''}
            onChange={(e) => setForm({ ...form, valorTotal: Number(e.target.value) })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Cliente</InputLabel>
            <Select
              value={form.cliente?.id || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  cliente: clientes.find((cliente) => cliente.id === Number(e.target.value)) || form.cliente,
                })
              }
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Energia</InputLabel>
            <Select
              value={form.energia?.id || ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  energia: energias.find((energia) => energia.id === Number(e.target.value)) || form.energia,
                })
              }
            >
              {energias.map((energia) => (
                <MenuItem key={energia.id} value={energia.id}>
                  {energia.tipoEnergia}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransacaoCrud;
