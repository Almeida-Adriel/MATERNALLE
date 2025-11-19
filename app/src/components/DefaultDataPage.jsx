import React from 'react';
import ToolSearch from './ToolSearch';

const DefaultDataPage = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  dataList = [],
  onSearch = () => {},
  query = '',
  order = 'newest',
  onOrderChange = () => {},
  labelButton,
  onOpenCreate = () => {},
}) => {
  return (
    <>
      <ToolSearch
        search={query}
        onSearch={onSearch}
        order={order}
        onOrderChange={onOrderChange}
        labelButton={labelButton}
        onOpenCreate={onOpenCreate}
      />

      {/* Renderizar os dados da lista */}
      <div className="mt-6">
        {dataList.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl border border-brand-100 bg-white shadow-md"
          >
            <h4>{item.titulo}</h4>
            <p>{item.descricao}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-around items-center gap-4 mt-4">
        <button
          className="px-4 py-2 rounded-xl bg-brand-600 text-white"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button
          className="px-4 py-2 rounded-xl bg-brand-600 text-white"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próxima
        </button>
      </div>
    </>
  );
};

export default DefaultDataPage;
