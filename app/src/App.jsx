import './App.css';
import Layout from './components/DefaultLayout';
import Cadastro from './pages/Cadastro';
import Login from './pages/Login';
import Home from './pages/Home';
import Auth from './utils/Auth';

import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

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
        <Route path="/" element={<Home />} />
        <Route
          path="/layout"
          element={
              <Layout />
          }
        />
      </Routes>
    </BrowserRouter>
    </>
)}

export default App;
