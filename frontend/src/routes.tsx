import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Energia from './pages/Energia'; // Componente de Energia
import Transacoes from './pages/Transacoes'; // Componente de Transações

// Função para verificar se o usuário está autenticado
const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken'); // Substitua 'authToken' pelo nome correto, se necessário
  return !!token; // Retorna true se o token existir, false caso contrário
};

// Componente para proteger rotas
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/" replace />;
};

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Rota pública: Login */}
    <Route path="/" element={<Login />} />

    {/* Rotas protegidas */}
    <Route
      path="/dashboard"
      element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      }
    />
    <Route
      path="/chat"
      element={
        <PrivateRoute>
          <Chat />
        </PrivateRoute>
      }
    />
    <Route
      path="/dashboard/energia"
      element={
        <PrivateRoute>
          <Energia />
        </PrivateRoute>
      }
    />
    <Route
      path="/dashboard/transacoes"
      element={
        <PrivateRoute>
          <Transacoes />
        </PrivateRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
