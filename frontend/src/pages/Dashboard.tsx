import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import ChatIcon from '@mui/icons-material/Chat';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BusinessIcon from '@mui/icons-material/Business';
import LogoutIcon from '@mui/icons-material/Logout'; // Ícone para logout
import { IconButton } from '@mui/material';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Chat from './Chat';
import Energia from './Energia';
import Transacoes from './Transacoes';
import EnergiaCrud from './EnergiaCrud';
import FornecedorCrud from './FornecedorCrud';
import TransacaoCrud from './TransacaoCrud';
import { Navigate } from 'react-router-dom';

// Função de logout
const handleLogout = () => {
  // Remove o token de autenticação
  localStorage.removeItem('authToken');

  // Redireciona para a página de login
  window.location.href = '/';
};

// Navegação lateral
const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'energia',
    title: 'Energia',
    icon: <ElectricBoltIcon />,
  },
  {
    segment: 'transacoes',
    title: 'Transações',
    icon: <ReceiptIcon />,
  },
  {
    segment: 'chat',
    title: 'Chat',
    icon: <ChatIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Manage',
  },
  {
    segment: 'energiacrud',
    title: 'Gerenciar Energia',
    icon: <ElectricBoltIcon />,
  },
  {
    segment: 'fornecedores',
    title: 'Gerenciar Fornecedores',
    icon: <BusinessIcon />,
  },
  {
    segment: 'transacaocrud',
    title: 'Gerenciar Transações',
    icon: <ReceiptIcon />,
  },
  {
    kind: 'divider',
  },
];

// Tema fixo escuro
const demoTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
      paper: '#1E1E1E',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B3B3B3',
    },
    primary: {
      main: '#BB86FC',
    },
    secondary: {
      main: '#03DAC6',
    },
  },
});

// Função para verificar se o usuário está autenticado
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token; // Retorna true se o token estiver presente
};

// Componente para proteger as rotas
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />; // Redireciona para a página de login se não autenticado
  }
  return <>{children}</>;
};

function DemoPageContent({ pathname }: { pathname: string }) {
  // Verifica o segmento da URL e renderiza o componente apropriado
  switch (pathname) {
    case '/dashboard':
      return (
        <Box
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5">Bem-vindo ao Dashboard!</Typography>
        </Box>
      );
    case '/energia':
      return (
        <ProtectedRoute>
          <Energia />
        </ProtectedRoute>
      );
    case '/transacoes':
      return (
        <ProtectedRoute>
          <Transacoes />
        </ProtectedRoute>
      );
    case '/chat':
      return (
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      );
    case '/energiacrud':
      return (
        <ProtectedRoute>
          <EnergiaCrud />
        </ProtectedRoute>
      );
    case '/fornecedores':
      return (
        <ProtectedRoute>
          <FornecedorCrud />
        </ProtectedRoute>
      );
    case '/transacaocrud':
      return (
        <ProtectedRoute>
          <TransacaoCrud />
        </ProtectedRoute>
      );
    default:
      return (
        <Box
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h5">Página não encontrada: {pathname}</Typography>
        </Box>
      );
  }
}

interface DemoProps {
  window?: () => Window;
}

export default function DashboardLayoutBasic(props: DemoProps) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        {/* Adiciona o botão de logout no cabeçalho */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            padding: 2,
            backgroundColor: demoTheme.palette.background.paper,
          }}
        >
          <IconButton color="primary" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Box>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
  );
}
