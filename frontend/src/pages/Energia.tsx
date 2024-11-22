import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, CircularProgress, Grid } from '@mui/material';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Line } from 'react-chartjs-2';
import GaugeChart from 'react-gauge-chart'; // Biblioteca para o gráfico de medidor
import axios from '../api/api';

// Registrar os elementos necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement);

const Energia: React.FC = () => {
  const [energia, setEnergia] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const staticData = {
    quantidadeTotal: 1000,
    quantidadeConsumida: 300,
    economia: 150, // Economia fictícia em kWh
    eficiencia: 0.75, // Eficiência fictícia (75%)
    consumoEsperado: [100, 200, 300, 400, 500, 600],
    consumoGasto: [90, 220, 280, 390, 480, 550],
  };

  useEffect(() => {
    const fetchEnergia = async () => {
      try {
        const response = await axios.get('/energia');
        setEnergia(response.data);
      } catch (error) {
        console.error('Erro ao carregar dados de energia:', error);
        setEnergia(staticData); // Dados estáticos em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchEnergia();
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

  const quantidadeDisponivel = energia.quantidadeTotal - energia.quantidadeConsumida;

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Consumo Esperado (kWh)',
        data: energia.consumoEsperado || staticData.consumoEsperado,
        borderColor: '#03DAC6',
        backgroundColor: 'rgba(3, 218, 198, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
      {
        label: 'Consumo Gasto (kWh)',
        data: energia.consumoGasto || staticData.consumoGasto,
        borderColor: '#FF5722',
        backgroundColor: 'rgba(255, 87, 34, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#121212', color: '#FFFFFF' }}>
      <Card sx={{ backgroundColor: '#1E1E1E', color: '#FFFFFF', marginBottom: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Energia Disponível
          </Typography>
          <Typography>
            <strong>Total:</strong> {energia.quantidadeTotal} kWh
          </Typography>
          <Typography>
            <strong>Consumida:</strong> {energia.quantidadeConsumida} kWh
          </Typography>
          <Typography>
            <strong>Economia:</strong> {energia.economia || staticData.economia} kWh
          </Typography>
          <Typography>
            <strong>Status Blockchain:</strong>{' '}
            {energia.statusBlockchain || 'Indisponível'}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#1E1E1E', color: '#FFFFFF' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Eficiência de Consumo
              </Typography>
              <GaugeChart
                id="gauge-chart"
                nrOfLevels={20}
                colors={['#FF5722', '#FFC107', '#4CAF50']}
                arcWidth={0.3}
                percent={energia.eficiencia || staticData.eficiencia}
                textColor="#FFFFFF"
                needleColor="#000000"
                needleBaseColor="#000000"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: '#1E1E1E', color: '#FFFFFF' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Consumo Esperado vs. Gasto
              </Typography>
              <Line data={lineData} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#1E1E1E', color: '#FFFFFF' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Economia Comparativa
              </Typography>
              <Typography variant="body2" gutterBottom>
                Comparação do consumo de energia renovável com o tradicional.
              </Typography>
              <Line
                data={{
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                  datasets: [
                    {
                      label: 'Energia Tradicional (kWh)',
                      data: [150, 300, 450, 600, 750, 900],
                      borderColor: '#FFC107',
                      backgroundColor: 'rgba(255, 193, 7, 0.2)',
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    {
                      label: 'Energia Renovável (kWh)',
                      data: energia.consumoGasto || staticData.consumoGasto,
                      borderColor: '#4CAF50',
                      backgroundColor: 'rgba(76, 175, 80, 0.2)',
                      borderWidth: 2,
                      tension: 0.4,
                    },
                  ],
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Energia;
