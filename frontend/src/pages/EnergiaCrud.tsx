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

interface Fornecedor {
  id: number;
  nome: string;
}

interface Energia {
  id: number;
  tipoEnergia: string;
  quantidadeDisponivel: number;
  precoUnitario: number;
  fornecedorId: number; // ID do fornecedor
  fornecedor?: Fornecedor; // Objeto fornecedor (opcional)
}

const EnergiaCrud: React.FC = () => {
  const [energias, setEnergias] = useState<Energia[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [form, setForm] = useState<Partial<Energia>>({});

  useEffect(() => {
    fetchEnergias();
    fetchFornecedores();
  }, []);

  const fetchEnergias = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/energia', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      setEnergias(data.content || []);
    } catch (error) {
      console.error('Erro ao carregar energias:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFornecedores = async () => {
    try {
      const response = await fetch('http://localhost:8080/fornecedores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      setFornecedores(data.content || []);
    } catch (error) {
      console.error('Erro ao carregar fornecedores:', error);
    }
  };

  const handleSave = async () => {
    if (!form.tipoEnergia || !form.quantidadeDisponivel || !form.precoUnitario || !form.fornecedorId) {
      alert('Todos os campos são obrigatórios!');
      return;
    }

    const method = form.id ? 'PUT' : 'POST';
    const url = form.id
      ? `http://localhost:8080/energia/${form.id}`
      : 'http://localhost:8080/energia';

    const payload = {
      tipoEnergia: form.tipoEnergia,
      quantidadeDisponivel: form.quantidadeDisponivel,
      precoUnitario: form.precoUnitario,
      fornecedor: {
        id: form.fornecedorId,
      },
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      fetchEnergias();
      handleClose();
    } catch (error) {
      console.error('Erro ao salvar energia:', error);
      alert('Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/energia/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      fetchEnergias();
    } catch (error) {
      console.error('Erro ao deletar energia:', error);
    }
  };

  const handleOpen = (energia?: Energia) => {
    setForm(energia ? { ...energia, fornecedorId: energia.fornecedor?.id } : {});
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
        Gerenciamento de Energia
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()} sx={{ marginBottom: 2 }}>
        Adicionar Nova Energia
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo de Energia</TableCell>
              <TableCell>Quantidade Disponível</TableCell>
              <TableCell>Preço Unitário</TableCell>
              <TableCell>Fornecedor</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {energias.map((energia) => (
              <TableRow key={energia.id}>
                <TableCell>{energia.tipoEnergia}</TableCell>
                <TableCell>{energia.quantidadeDisponivel}</TableCell>
                <TableCell>{energia.precoUnitario}</TableCell>
                <TableCell>
                  {energia.fornecedor?.nome || fornecedores.find((f) => f.id === energia.fornecedorId)?.nome || 'Desconhecido'}
                </TableCell>
                <TableCell>
                  <Button color="primary" onClick={() => handleOpen(energia)}>
                    Editar
                  </Button>
                  <Button color="secondary" onClick={() => handleDelete(energia.id)}>
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{form.id ? 'Editar Energia' : 'Adicionar Nova Energia'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Tipo de Energia"
            fullWidth
            value={form.tipoEnergia || ''}
            onChange={(e) => setForm({ ...form, tipoEnergia: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Quantidade Disponível"
            type="number"
            fullWidth
            value={form.quantidadeDisponivel || ''}
            onChange={(e) => setForm({ ...form, quantidadeDisponivel: Number(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Preço Unitário"
            type="number"
            fullWidth
            value={form.precoUnitario || ''}
            onChange={(e) => setForm({ ...form, precoUnitario: Number(e.target.value) })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Fornecedor</InputLabel>
            <Select
              value={form.fornecedorId || ''}
              onChange={(e) => setForm({ ...form, fornecedorId: Number(e.target.value) })}
            >
              {fornecedores.map((fornecedor) => (
                <MenuItem key={fornecedor.id} value={fornecedor.id}>
                  {fornecedor.nome}
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

export default EnergiaCrud;
