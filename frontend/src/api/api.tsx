import axios, { AxiosInstance } from 'axios';

// Criação da instância do Axios
const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('Token ausente! As solicitações podem falhar.');
    }
    return config;
  },
  (error) => {
    console.error('Erro na configuração da solicitação:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      console.error('Acesso negado. Verifique se você está autenticado.');
    } else if (error.response?.status === 401) {
      console.error('Sessão expirada. Redirecionando para login...');
      localStorage.removeItem('authToken');
      window.location.href = '/'; // Redireciona para a página de login
    }
    return Promise.reject(error);
  }
);


export default api;
