import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import customTheme from '../utils/CustomTheme';
import Service from '../utils/Service';
import Auth from '../utils/Auth';

const service = new Service();
const auth = new Auth();

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor, preencha todos os campos para continuar.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await service.login(email, password);
      auth.saveDataLogin({ userEmail: response.data.userEmail });

       if (onLoginSuccess) {
          onLoginSuccess();
        }

      navigate('/dashboard', { replace: true });
    } catch (error) {
      const errorMessage = 
        typeof error === 'object' && error !== null && error.error 
        ? error.error 
        : 'Erro ao tentar fazer login. Verifique suas credenciais.';
      setError(errorMessage);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <div className="h-screen flex items-center justify-center bg-gradient-to-b from-white to-brand-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-center text-3xl font-semibold text-brand-700 mb-6">Login</h2>
          <form onSubmit={handleSubmit}>
            {error && (
                <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
                    <Alert variant="outlined" severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                </Stack>
            )}
            <div className="mb-4">
              <TextField
                id="email-input"
                label="E-mail"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                color="primary"
                autoComplete="email"
              />
            </div>
            <div className="mb-6">
             <TextField
              id="password-input"
              label="Senha"
              type="password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              color="primary"
              autoComplete="current-password"
            />
            </div>
            <Button 
              type="submit" 
              className="w-full p-3 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-800"
              variant="contained"
              loading={loading}
            >
              Entrar
            </Button>
          </form>
        <div className="text-center pt-2">
          <a href="#" className="text-sm text-brand-600 hover:text-brand-800 transition duration-150">
            Esqueceu a senha?
          </a>
        </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Login;