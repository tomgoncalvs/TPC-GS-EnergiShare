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
} from '@mui/material';

interface Fornecedor {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  telefone?: string;
  endereco?: string;
  dataCadastro?: string;
}

const FornecedorCrud: React.FC = () => {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<Partial<Fornecedor>>({});

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const fetchFornecedores = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/fornecedores');
      if (!response.ok) {
        throw new Error(`Erro ao carregar fornecedores: ${response.status}`);
      }
      const data = await response.json();
      setFornecedores(data.content || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id
        ? `http://localhost:8080/fornecedores/${form.id}`
        : 'http://localhost:8080/fornecedores';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar fornecedor: ${response.status}`);
      }

      fetchFornecedores();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/fornecedores/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar fornecedor: ${response.status}`);
      }

      fetchFornecedores();
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = (fornecedor?: Fornecedor) => {
    setForm(fornecedor || {});
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
        Gerenciamento de Fornecedores
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ marginBottom: 2 }}>
        Adicionar Novo Fornecedor
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Endereço</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fornecedores.map((fornecedor) => (
              <TableRow key={fornecedor.id}>
                <TableCell>{fornecedor.nome}</TableCell>
                <TableCell>{fornecedor.email}</TableCell>
                <TableCell>{fornecedor.telefone || 'N/A'}</TableCell>
                <TableCell>{fornecedor.endereco || 'N/A'}</TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(fornecedor)}>
                    Editar
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(fornecedor.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{form.id ? 'Editar Fornecedor' : 'Adicionar Novo Fornecedor'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            fullWidth
            value={form.nome || ''}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={form.email || ''}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Senha"
            type="password"
            fullWidth
            value={form.senhaHash || ''}
            onChange={(e) => setForm({ ...form, senhaHash: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefone"
            fullWidth
            value={form.telefone || ''}
            onChange={(e) => setForm({ ...form, telefone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Endereço"
            fullWidth
            value={form.endereco || ''}
            onChange={(e) => setForm({ ...form, endereco: e.target.value })}
          />
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

export default FornecedorCrud;
