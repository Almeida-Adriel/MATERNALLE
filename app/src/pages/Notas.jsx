import React, { useEffect, useMemo, useState } from 'react';
import {
  MdEditNote,
  MdSearch,
  MdAdd,
  MdPushPin,
  MdOutlinePushPin,
  MdDelete,
  MdClose,
  MdSave,
} from 'react-icons/md';
import Service from '../utils/service/Service';
import Auth from '../utils/service/Auth';

const service = new Service();
const auth = new Auth();

const usuarioId = auth.getId();

// --- Helpers ---
const formatDateBR = (d) => {
  try {
    const dt = typeof d === 'string' || typeof d === 'number' ? new Date(d) : d;
    if (isNaN(dt.getTime())) return '--/--/----';
    return dt.toLocaleDateString('pt-BR');
  } catch {
    return '--/--/----';
  }
};

const debounce = (fn, delay = 400) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};

// --- Componentes de UI ---
const Toolbar = ({
  search,
  onSearch,
  order,
  onOrderChange,
  onlyPinned,
  onTogglePinned,
  onOpenCreate,
}) => (
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

      <button
        onClick={onOpenCreate}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
      >
        <MdAdd size={18} /> Nova nota
      </button>
    </div>
  </div>
);

const NoteCard = ({ note, onTogglePin, onEdit, onDelete }) => (
  <div className="group p-4 rounded-2xl border border-brand-100 bg-white hover:shadow-md transition-shadow relative">
    <button
      className="absolute -top-2 -right-2 bg-white border border-brand-100 rounded-full p-2 shadow-sm hover:shadow md:opacity-0 md:group-hover:opacity-100 transition-opacity"
      onClick={() => onTogglePin(note)}
      title={note.lembrete ? 'Desativar Lembrete' : 'Ativar Lembrete'}
    >
      {note.lembrete ? (
        <MdPushPin className="text-brand-700" />
      ) : (
        <MdOutlinePushPin className="text-slate-500" />
      )}
    </button>

    <h4 className="font-semibold text-brand-800 pr-10 break-words">
      {note.titulo || '(Sem título)'}
    </h4>
    <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">
      {note.descricao}
    </p>

    <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400">
      <span>Criada em: {formatDateBR(note.data_criacao)}</span>

      {note.lembrete && note.data_lembrete && (
        <span className="text-red-500 font-medium ml-2 mt-1 sm:mt-0">
          Lembrete: {formatDateBR(note.data_lembrete)}
        </span>
      )}

      <div className="flex items-center gap-2 mt-2 sm:mt-0">
        <button
          className="px-2 py-1 rounded-lg border border-brand-100 hover:bg-brand-50 text-slate-600"
          onClick={() => onEdit(note)}
        >
          Editar
        </button>
        <button
          className="px-2 py-1 rounded-lg border border-red-100 hover:bg-red-50 text-red-600"
          onClick={() => onDelete(note)}
        >
          <MdDelete />
        </button>
      </div>
    </div>
  </div>
);

const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl mx-auto bg-white rounded-2xl border border-brand-100 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 sticky top-0 bg-white z-20">
          <h3 className="text-lg font-semibold text-brand-800">{title}</h3>
          <button
            className="p-2 rounded-lg hover:bg-slate-50"
            onClick={onClose}
          >
            <MdClose />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const NoteForm = ({ initial, loading, onSubmit }) => {
  const [titulo, setTitulo] = useState(initial?.titulo || '');
  const [descricao, setDescricao] = useState(initial?.descricao || '');
  const [lembrete, setLembrete] = useState(initial?.lembrete || false);
  const [dataLembrete, setDataLembrete] = useState(
    initial?.data_lembrete
      ? new Date(initial.data_lembrete).toISOString().substring(0, 10)
      : ''
  );

  useEffect(() => {
    setTitulo(initial?.titulo || '');
    setDescricao(initial?.descricao || '');
    setLembrete(initial?.lembrete || false);
    setDataLembrete(
      initial?.data_lembrete
        ? new Date(initial.data_lembrete).toISOString().substring(0, 10)
        : ''
    );
  }, [initial]);

  const canSave = titulo.trim().length > 0 || descricao.trim().length > 0;
  const isLembreteValid = !lembrete || (lembrete && dataLembrete);

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSave || !isLembreteValid) return;
        onSubmit({
          titulo: titulo.trim(),
          descricao: descricao.trim(),
          lembrete,
          data_lembrete:
            lembrete && dataLembrete ? `${dataLembrete}T00:00:00.000Z` : null,
        });
      }}
    >
      <div className="space-y-1">
        <label className="text-sm text-slate-600">Título</label>
        <input
          className="w-full px-3 py-2 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex.: Dúvidas para próxima consulta"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-600">Conteúdo (Descrição)</label>
        <textarea
          rows={6}
          className="w-full px-3 py-2 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Escreva livremente…"
        />
      </div>

      <div className="flex flex-col gap-3 pt-2 border-t border-slate-100">
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={lembrete}
            onChange={(e) => {
              setLembrete(e.target.checked);
              // Limpa a data se o lembrete for desativado
              if (!e.target.checked) setDataLembrete('');
            }}
          />
          Ativar Lembrete
        </label>

        {lembrete && (
          <div className="space-y-1">
            <label className="text-sm text-slate-600">Data do Lembrete</label>
            <input
              type="date"
              className="w-full px-3 py-2 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
              value={dataLembrete}
              onChange={(e) => setDataLembrete(e.target.value)}
              required={lembrete}
            />
            {!dataLembrete && (
              <p className="text-xs text-red-500 mt-1">
                A data do lembrete é obrigatória.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end pt-3">
        <button
          disabled={!canSave || loading || !isLembreteValid}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white ${
            !canSave || loading || !isLembreteValid
              ? 'bg-slate-300'
              : 'bg-brand-600 hover:bg-brand-700'
          }`}
          type="submit"
        >
          <MdSave /> {loading ? 'Salvando…' : 'Salvar'}
        </button>
      </div>
    </form>
  );
};

// --- Componente Principal ---
const Notas = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('newest');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // Busca inicial
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await service.getWithParams('notas', {
        id_usuario: usuarioId,
      });
      const lista = Array.isArray(res?.data) ? res.data : [];
      setNotes(
        lista.map((n) => ({
          ...n,
          data_criacao: new Date(n.data_criacao),
          data_lembrete: n.data_lembrete ? new Date(n.data_lembrete) : null,
        }))
      );
    } catch (e) {
      console.error('Erro ao carregar notas:', e);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handlers CRUD
  const handleCreate = async (payload) => {
    setSaving(true);
    try {
      const body = { ...payload, id_usuario: usuarioId };

      const res = await service.post('notas', body);
      const created = res?.data;

      if (created) {
        setNotes((prev) => [
          {
            ...created,
            data_criacao: new Date(created.data_criacao),
            data_lembrete: created.data_lembrete
              ? new Date(created.data_lembrete)
              : null,
          },
          ...prev,
        ]);
        setOpenModal(false);
        setEditing(null);
      }
    } catch (e) {
      console.error('Erro ao criar nota:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    setSaving(true);
    try {
      const body = payload;

      const res = await service.put(`notas/${editing.id}`, body);
      const updatedNote = res?.data;

      if (updatedNote) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === editing.id
              ? {
                  ...updatedNote,
                  data_criacao: new Date(updatedNote.data_criacao),
                  data_lembrete: updatedNote.data_lembrete
                    ? new Date(updatedNote.data_lembrete)
                    : null,
                }
              : n
          )
        );
        setOpenModal(false);
        setEditing(null);
      }
    } catch (e) {
      console.error('Erro ao atualizar nota:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (note) => {
    if (!confirm(`Excluir a nota "${note.titulo || '(sem título)'}"?`)) return;
    try {
      await service.delete(`notas/${note.id}`);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (e) {
      console.error('Erro ao excluir nota:', e);
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const isLembrete = !note.lembrete;
      const updatedPayload = {
        titulo: note.titulo,
        descricao: note.descricao,
        lembrete: isLembrete,
        data_lembrete: isLembrete
          ? note.data_lembrete?.toISOString() || null
          : null,
      };

      const res = await service.put(`notas/${note.id}`, updatedPayload);
      const updatedNote = res?.data;

      if (updatedNote) {
        setNotes((prev) =>
          prev.map((n) =>
            n.id === note.id
              ? {
                  ...updatedNote,
                  // 🚀 Ajustado: Usando updatedNote.data_criacao
                  data_criacao: new Date(updatedNote.data_criacao),
                  data_lembrete: updatedNote.data_lembrete
                    ? new Date(updatedNote.data_lembrete)
                    : null,
                }
              : n
          )
        );
      }
    } catch (e) {
      console.error('Erro ao fixar/desafixar (lembrete):', e);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setOpenModal(true);
  };

  const openEdit = (note) => {
    setEditing(note);
    setOpenModal(true);
  };

  const onSearch = useMemo(() => debounce((v) => setQuery(v), 250), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = [...notes];

    if (onlyPinned) arr = arr.filter((n) => n.lembrete);

    if (q) {
      arr = arr.filter(
        (n) =>
          (n.titulo || '').toLowerCase().includes(q) ||
          (n.descricao || '').toLowerCase().includes(q)
      );
    }

    if (order === 'newest')
      arr.sort((a, b) => new Date(b.data_criacao) - new Date(a.data_criacao));
    if (order === 'oldest')
      arr.sort((a, b) => new Date(a.data_criacao) - new Date(b.data_criacao));
    if (order === 'title')
      arr.sort((a, b) => (a.titulo || '').localeCompare(b.titulo || ''));

    return arr;
  }, [notes, query, order, onlyPinned]);

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
          <MdEditNote size={22} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-800">
            Notas
          </h1>
          <p className="text-sm text-slate-500">
            Guarde ideias, pontos para consultas e lembretes.
          </p>
        </div>
      </div>

      {/* Barra de ferramentas */}
      <div className="bg-white rounded-2xl shadow p-4 border border-brand-100">
        <Toolbar
          search={query}
          onSearch={onSearch}
          order={order}
          onOrderChange={setOrder}
          onlyPinned={onlyPinned}
          onTogglePinned={() => setOnlyPinned((v) => !v)}
          onOpenCreate={openCreate}
        />
      </div>

      {/* Lista de notas */}
      <section className="bg-white rounded-2xl shadow p-6 border border-brand-100 min-h-[320px]">
        {loading ? (
          <div className="text-center py-16 text-brand-600">
            Carregando notas…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            Nenhuma nota encontrada.
            <div>
              <button
                onClick={openCreate}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white"
              >
                <MdAdd /> Criar primeira nota
              </button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((n) => (
              <NoteCard
                key={n.id}
                note={n}
                onTogglePin={handleTogglePin}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      {/* Modal Criar/Editar */}
      <Modal
        open={openModal}
        onClose={() => {
          if (!saving) {
            setOpenModal(false);
            setEditing(null);
          }
        }}
        title={
          editing ? `Editar: ${editing.titulo || '(Sem título)'}` : 'Nova nota'
        }
      >
        <NoteForm
          initial={editing}
          loading={saving}
          onSubmit={(payload) =>
            editing ? handleUpdate(payload) : handleCreate(payload)
          }
        />
      </Modal>
    </div>
  );
};

export default Notas;
