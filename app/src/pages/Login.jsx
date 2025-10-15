import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica de autenticação
  };

  return (
    <div className="h-screen flex items-center justify-center bg-brand-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-center text-3xl font-semibold text-brand-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-brand-500" htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 p-3 border border-brand-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-brand-500" htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 p-3 border border-brand-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full p-3 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-800"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;