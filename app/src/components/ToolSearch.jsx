import React, { useState } from 'react'
import {
  MdSearch,
  MdAdd,
  MdPushPin,
} from 'react-icons/md';

const ToolSearch = ({
  search,
  onSearch = () => {},
  order,
  onOrderChange = () => {},
  onlyPinned = false,
  onTogglePinned = () => {},
  onOpenCreate = () => {},
  lembretes = false,
  labelButton
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="relative w-full sm:max-w-md">
        <MdSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          className="w-full pl-10 pr-3 py-2 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
          placeholder="Buscar por título ou conteúdo..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
  
      <div className="flex items-center gap-2">
        <select
          className="px-3 py-2 rounded-xl border border-brand-100 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-300"
          value={order}
          onChange={(e) => onOrderChange(e.target.value)}
        >
          <option value="newest">Mais recentes</option>
          <option value="oldest">Mais antigas</option>
          <option value="title">Título (A→Z)</option>
        </select>

        {lembretes &&
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
        }
  
        <button
          onClick={onOpenCreate}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
        >
          <MdAdd size={18} /> {labelButton || "Criar"}
        </button>
      </div>
    </div>
  )
}

export default ToolSearch