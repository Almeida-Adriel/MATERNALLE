import React, { useState, useEffect } from 'react';
import { MdSearch, MdAdd, MdPushPin } from 'react-icons/md';

const ToolSearch = ({
  search = '',
  onSearch = () => {},
  order,
  onOrderChange = () => {},
  onlyPinned = false,
  onTogglePinned = () => {},
  onOpenCreate = () => {},
  lembretes = false,
  labelButton,
  buttonCreate,
}) => {
  const [localSearch, setLocalSearch] = useState(search || '');

  useEffect(() => {
    setLocalSearch(search || '');
  }, [search]);

  const handleInputChange = (e) => {
    setLocalSearch(e.target.value);
  };

  const triggerSearch = () => {
    onSearch(localSearch);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      triggerSearch();
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4 border border-brand-100">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-lg flex">
          <input
            className="w-full pl-2 py-2 rounded-l-xl border border-brand-100 bg-white focus:outline-none focus:ring-1 focus:ring-brand-300"
            placeholder="Buscar por título ou conteúdo..."
            value={localSearch}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            className="w-10 flex items-center justify-center border border-brand-500 bg-brand-500 rounded-r-xl cursor-pointer"
            onClick={triggerSearch}
          >
            <MdSearch className="text-slate-50" size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="cursor-pointer px-3 py-2 rounded-xl border border-brand-100 bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-300"
            value={order}
            onChange={(e) => onOrderChange(e.target.value)}
          >
            <option value="desc">Mais recentes</option>
            <option value="asc">Mais antigas</option>
          </select>

          {lembretes && (
            <button
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${
                onlyPinned
                  ? 'border-brand-300 bg-brand-50 text-brand-800'
                  : 'border-brand-100 bg-white text-slate-700 hover:bg-slate-50'
              }`}
              onClick={onTogglePinned}
              title={
                onlyPinned
                  ? 'Mostrando notas com Lembrete'
                  : 'Mostrar somente notas com Lembrete'
              }
            >
              <MdPushPin /> Lembretes
            </button>
          )}

          {buttonCreate && (
            <button
              onClick={onOpenCreate}
              className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
            >
              <MdAdd size={18} /> {labelButton || 'Criar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolSearch;
