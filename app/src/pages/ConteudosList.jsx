import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Service from '../utils/service/Service';

const service = new Service();

const ConteudoId = () => {
  const [conteudos, setConteudos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConteudos = async () => {
    try {
      const pathSegments = window.location.pathname.split('/');
      const idUrl = pathSegments[pathSegments.length - 1];
      const response = await service.getWithParams('conteudos', { id: idUrl });
      setConteudos(response.data.conteudos);
    } catch (err) {
      setError('Erro ao carregar conteúdos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConteudos();
  }, []);

  return (
    <div className="w-full p-6">
      {loading && <p>Carregando conteúdos...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    </div>
  );
};

export default ConteudoId;
