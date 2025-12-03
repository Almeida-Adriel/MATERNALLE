import React, { useEffect, useState } from 'react';

// Components
import DefaultDataPage from '../components/DefaultDataPage';

// utils
import Service from '../utils/service/Service';

// icons
import { MdVisibility, MdOutlineLibraryBooks } from 'react-icons/md';

const service = new Service();
const ENDPOINT = '/conteudos/todos';

const Conteudos = () => {
  const [conteudos, setConteudos] = useState([]);
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchConteudos = async () => {
    setLoading(true);
    try {
      const res = await service.getWithParams(`${ENDPOINT}`, {
        search: query,
        order,
        page: currentPage,
      });

      const { conteudos, pagination } = res.data;

      setConteudos(conteudos || []);
      setTotalPages(Number(pagination?.totalPages) || 1);
      setCurrentPage(Number(pagination?.currentPage) || 1);
    } catch (error) {
      console.error('Erro ao listar conteúdos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConteudos();
  }, [query, order, currentPage]);

  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
          <MdOutlineLibraryBooks size={22} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-800">
            Material de Apoio
          </h1>
          <p className="text-sm text-slate-500">
            Conteúdos preparados e escolhidos por especialistas para você.
          </p>
        </div>
      </div>

      <DefaultDataPage
        currentPage={currentPage}
        totalPages={totalPages}
        dataList={conteudos}
        order={order}
        query={query}
        onSearch={(q) => {
          setQuery(q);
          setCurrentPage(1);
        }}
        onOrderChange={(o) => setOrder(o)}
        onPageChange={(p) => setCurrentPage(p)}
        loading={loading}
        buttonCreate={false}
        columns={[
          {
            key: 'titulo',
            header: 'Título',
          },
          {
            key: 'descricao',
            header: 'Descrição',
            render: (item) => (
              <span className="text-gray-600 block max-w-md truncate">
                {item.descricao}
              </span>
            ),
          },
          {
            key: 'acoes',
            header: 'Ações',
            align: 'center',
            width: 120,
            render: (item) => (
              <button
                className="text-indigo-700 bg-indigo-50 border border-indigo-200 p-1.5 rounded-md hover:bg-indigo-100 transition cursor-pointer"
                onClick={() => window.location.assign(`/conteudos/${item.id}`)}
                title="Visualizar conteúdo"
                aria-label="Visualizar conteúdo"
              >
                <MdVisibility size={18} />
              </button>
            ),
          },
        ]}
      />
    </>
  );
};

export default Conteudos;
