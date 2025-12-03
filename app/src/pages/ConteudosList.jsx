import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Service from '../utils/service/Service';
import { MdArrowBack } from 'react-icons/md';

const service = new Service();

const ConteudoId = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [conteudo, setConteudo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConteudo = async () => {
    try {
      const response = await service.getWithParams('conteudos', { id });
      const item = response?.data;

      if (!item) {
        setError('Conteúdo não encontrado.');
      } else {
        setConteudo(item);
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar conteúdo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConteudo();
  }, [id]);

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('pt-BR');
  };

  if (loading) return <p className="p-6">Carregando conteúdo...</p>;
  if (error) return <p className="p-6 text-red-600 font-medium">{error}</p>;

  return (
    <div className="mx-auto py-8 px-4">
      {/* Botão voltar */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-brand-600 font-medium hover:underline mb-6"
      >
        <MdArrowBack size={20} />
        Voltar
      </button>

      {/* Card principal */}
      <div className="bg-white shadow rounded-xl p-6 border border-brand-100">
        <div className="flex mb-4 justify-between">
          {/* Título */}
          <h1 className="text-3xl font-bold text-brand-700">
            {conteudo.titulo}
          </h1>

          {/* Metadados */}
          <div className="invisible md:visible">
            <p className="text-sm text-slate-500 block">
              Tipo:{' '}
              <span className="font-medium">{conteudo.tipo_conteudo}</span>
            </p>
            <p className="text-sm text-slate-500 block">
              Publicado em: {formatDate(conteudo.data_criacao)}
            </p>
          </div>
        </div>

        {/* Texto completo */}
        <div className="max-w-none flex gap-4 whitespace-pre-line leading-relaxed text-slate-700">
          {conteudo.descricao}
          {/* Imagem (se existir) */}
          {conteudo.imagemUrl && (
            <img
              src={conteudo.imagemUrl}
              alt={conteudo.titulo}
              className="w-40 h-38 rounded-lg mb-4 shadow"
            />
          )}
        </div>

        {/* Link de referência */}
        {conteudo.link_referencia && (
          <a
            href={conteudo.link_referencia}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block text-brand-600 font-medium underline hover:text-brand-700"
          >
            Ver referência externa
          </a>
        )}
      </div>
    </div>
  );
};

export default ConteudoId;
