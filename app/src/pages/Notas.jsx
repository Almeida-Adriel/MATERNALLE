import React, { useEffect, useMemo, useState } from 'react';
import {
  MdEditNote,
  MdAdd,
  MdPushPin,
  MdOutlinePushPin,
  MdDelete,
  MdClose,
  MdSave,
} from 'react-icons/md';
import Service from '../utils/service/Service';
import Auth from '../utils/service/Auth';
import { tipoLembreteEnum } from '../utils/enum/tipoLembrete';
import { getTomorrowDate } from '../utils/getDate';
import ToolSearch from '../components/ToolSearch';

const service = new Service();
const auth = new Auth();

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

   {note.lembrete && (
     <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
       {note.tipo && (
         <span className="px-2 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-100">
           {note.tipo === 'Outro' && note.outro ? `Outro: ${note.outro}` : note.tipo}
         </span>
       )}
     </div>
   )}

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
  const [tipoLembrete, setTipoLembrete] = useState(initial?.tipo || '');
  const [outro, setOutro] = useState(initial?.outro || '');
  const [dataLembrete, setDataLembrete] = useState(
    initial?.data_lembrete
      ? new Date(initial.data_lembrete).toISOString().substring(0, 10)
      : ''
  );

  useEffect(() => {
    setTitulo(initial?.titulo || '');
    setDescricao(initial?.descricao || '');
    setLembrete(initial?.lembrete || false);
    setTipoLembrete(initial?.tipo || '');
    setOutro(initial?.outro || '');
    setDataLembrete(
      initial?.data_lembrete
        ? new Date(initial.data_lembrete).toISOString().substring(0, 10)
        : ''
    );
  }, [initial]);

  const canSave = titulo.trim().length > 0 || descricao.trim().length > 0;
  const isLembreteValid =
  !lembrete ||
  (lembrete &&
    dataLembrete &&
    tipoLembrete &&
    (tipoLembrete !== 'Outro' || (tipoLembrete === 'Outro' && outro.trim().length > 0)));


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
            tipo: lembrete ? tipoLembrete : '',
            outro: lembrete && tipoLembrete === 'Outro' ? outro.trim() : '',
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
              if (!e.target.checked) {
                  setDataLembrete('')
                  setTipoLembrete('')
                  setOutro('')
              };
            }}
          />
          Ativar Lembrete
        </label>

        {lembrete && (
          <>
            <div className="space-y-1">
              <label className="text-sm text-slate-600">Data do Lembrete</label>
              <input
                type="date"
                className="w-full px-3 py-2 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
                value={dataLembrete}
                onChange={(e) => setDataLembrete(e.target.value)}
                required={lembrete}
                min={getTomorrowDate()}
              />
              {!dataLembrete && (
                <p className="text-xs text-red-500 mt-1">
                  A data do lembrete é obrigatória.
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-600">Tipo de Lembrete</label>
              <select
                className="w-full px-3 py-2 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
                value={tipoLembrete}
                onChange={(e) => setTipoLembrete(e.target.value)}
                required={lembrete}
              >
                <option value="">Selecione…</option>
                {tipoLembreteEnum && Object.entries(tipoLembreteEnum).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value}
                  </option>
                ))}
              </select>
              {(!tipoLembrete) && <p className="text-xs text-red-500 mt-1">Selecione um tipo.</p>}
            </div>
            {tipoLembrete === 'Outro' && (
              <div className="space-y-1">
                <label className="text-sm text-slate-600">Especifique o Outro Tipo</label>
                <input
                  className="w-full px-3 py-2 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
                  value={outro}
                  onChange={(e) => setOutro(e.target.value)}
                  placeholder="Descreva o outro tipo de lembrete"
                  required={tipoLembrete === 'Outro'}
                />
              </div>
            )}
          </>
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
  const [usuarioId, setusuarioId] = useState(auth.getId());
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('newest');
  const [onlyPinned, setOnlyPinned] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  const getApiError = (e) => {
    try {
      if (e?.error) return e.error;
    } catch {}
    return 'Ocorreu um erro inesperado.';
  };

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
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
      setError(getApiError(e));
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
    setModalError(null);
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
      setModalError(getApiError(e));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    setSaving(true);
    setModalError(null);
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
      setModalError(getApiError(e));
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
      setError(getApiError(e));
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const isLembrete = !note.lembrete;
      const updatedPayload = {
        titulo: note.titulo,
        descricao: note.descricao,
        lembrete: isLembrete,
        tipo: isLembrete ? note.tipo : '',
        outro: isLembrete ? note.outro : '',
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
      setError(getApiError(e));
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

  const onSearch = (v) => setQuery(v);

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
        <ToolSearch
          search={query}
          onSearch={onSearch}
          order={order}
          onOrderChange={setOrder}
          onlyPinned={onlyPinned}
          onTogglePinned={() => setOnlyPinned((v) => !v)}
          onOpenCreate={openCreate}
          lembretes={true}
          labelButton={"Nova Nota"}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-4 py-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium">Erro: {error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-600/70 hover:text-red-800 text-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

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
        {modalError && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
            {modalError}
          </div>
        )}
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
