import React, { useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/DefaultLayout';
import EsqueciMinhaSenha from './pages/esqueciMinhaSenha';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Home from './pages/Home';
import Auth from './utils/service/Auth';
import './App.css';

const autentication = new Auth()

function App() {

  function PrivateRoute({ children }) {
    return autentication.isAuthenticated()
      ? children
      : <Navigate to="/login" replace />;
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
                <Layout />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
)}

export default App;
