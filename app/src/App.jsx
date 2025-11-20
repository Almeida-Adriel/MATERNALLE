import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Layout from './components/DefaultLayout';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import EsqueciMinhaSenha from './pages/esqueciMinhaSenha';
import Home from './pages/Home';
import Auth from './utils/service/Auth';
import './App.css';

const autentication = new Auth();

function App() {
  function PrivateRoute({ children }) {
    return autentication.isAuthenticated() ? (
      children
    ) : (
      <Navigate to="/login" replace />
    );
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueci-minha-senha" element={<EsqueciMinhaSenha />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <SnackbarProvider
                  autoHideDuration={2400}
                  maxSnack={2}
                  anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <Layout />
                </SnackbarProvider>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
