import React, { useEffect, useMemo, useState } from "react";
import { MdEditNote, MdSearch, MdAdd, MdPushPin, MdOutlinePushPin, MdDelete, MdClose, MdSave } from "react-icons/md";
import Service from "../utils/service/Service";

const service = new Service();

const formatDateBR = (d) => {
  try {
    const dt = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
    return dt.toLocaleDateString("pt-BR");
  } catch {
    return "--/--/----";
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
const Toolbar = ({ search, onSearch, order, onOrderChange, onlyPinned, onTogglePinned, onOpenCreate }) => (
  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
    <div className="relative w-full sm:max-w-md">
      <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
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
            ? "border-brand-300 bg-brand-50 text-brand-800"
            : "border-brand-100 bg-white text-slate-700 hover:bg-slate-50"
        }`}
        onClick={onTogglePinned}
        title={onlyPinned ? "Mostrando fixadas" : "Mostrar somente fixadas"}
      >
        <MdPushPin /> Fixadas
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
      title={note.pinned ? "Desafixar" : "Fixar nota"}
    >
      {note.pinned ? <MdPushPin className="text-brand-700" /> : <MdOutlinePushPin className="text-slate-500" />}
    </button>

    <h4 className="font-semibold text-brand-800 pr-10 break-words">{note.title || "(Sem título)"}</h4>
    <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{note.content}</p>

    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
      <span>{formatDateBR(note.date)}</span>
      <div className="flex items-center gap-2">
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
      <div className="relative z-10 w-full max-w-xl mx-auto bg-white rounded-2xl border border-brand-100 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-semibold text-brand-800">{title}</h3>
          <button className="p-2 rounded-lg hover:bg-slate-50" onClick={onClose}>
            <MdClose />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

const NoteForm = ({ initial, loading, onSubmit }) => {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [pinned, setPinned] = useState(initial?.pinned || false);

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
    setPinned(initial?.pinned || false);
  }, [initial]);

  const canSave = title.trim().length > 0 || content.trim().length > 0;

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSave) return;
        onSubmit({ title: title.trim(), content: content.trim(), pinned });
      }}
    >
      <div className="space-y-1">
        <label className="text-sm text-slate-600">Título</label>
        <input
          className="w-full px-3 py-2 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ex.: Dúvidas para próxima consulta"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-600">Conteúdo</label>
        <textarea
          rows={6}
          className="w-full px-3 py-2 rounded-xl border border-brand-100 bg-white focus:outline-none focus:ring-2 focus:ring-brand-300"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva livremente…"
        />
      </div>

      <div className="flex items-center justify-between">
        <label className="inline-flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} />
          Fixar nota
        </label>

        <button
          disabled={!canSave || loading}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white ${
            !canSave || loading ? "bg-slate-300" : "bg-brand-600 hover:bg-brand-700"
          }`}
          type="submit"
        >
          <MdSave /> {loading ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </form>
  );
};

// --- Página principal ---
const Notas = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState("newest");
  const [onlyPinned, setOnlyPinned] = useState(false);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState(null);

  // Busca inicial
  const fetchNotes = async () => {
    setLoading(true);
    try {
      // Backend real:
      // const res = await service.get("nota");
      // const lista = Array.isArray(res?.data) ? res.data : [];
      // setNotes(lista.map(n => ({ ...n, date: new Date(n.date) })));

      // Mock de fallback
      await new Promise((r) => setTimeout(r, 300));
      setNotes([
        { id: 1, title: "Primeira consulta de rotina", content: "O pediatra verificou o peso e altura. Tudo dentro do esperado.", date: new Date(2025, 9, 28), pinned: true },
        { id: 2, title: "Dúvidas sobre amamentação", content: "Pesquisar sobre a pega correta e consultar a doula.", date: new Date(2025, 9, 25), pinned: false },
        { id: 3, title: "Compra de vitaminas", content: "Lembrar de comprar vitamina D para o bebê na próxima semana.", date: new Date(2025, 9, 20), pinned: false },
      ]);
    } catch (e) {
      console.error("Erro ao carregar notas:", e);
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
      const newNote = {
        id: Math.max(0, ...notes.map((n) => n.id)) + 1,
        title: payload.title,
        content: payload.content,
        date: new Date(),
        pinned: !!payload.pinned,
      };

      // Backend real:
      // const res = await service.post("nota", newNote);
      // const created = res?.data ?? newNote;
      // setNotes((prev) => [{ ...created, date: new Date(created.date) }, ...prev]);

      // Mock otimista
      setNotes((prev) => [newNote, ...prev]);
      setOpenModal(false);
      setEditing(null);
    } catch (e) {
      console.error("Erro ao criar nota:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (payload) => {
    if (!editing) return;
    setSaving(true);
    try {
      const updated = { ...editing, ...payload };

      // Backend real:
      // await service.put(`nota/${editing.id}`, updated);

      // Mock otimiz.
      setNotes((prev) => prev.map((n) => (n.id === editing.id ? { ...updated } : n)));
      setOpenModal(false);
      setEditing(null);
    } catch (e) {
      console.error("Erro ao atualizar nota:", e);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (note) => {
    if (!confirm(`Excluir a nota "${note.title || "(sem título)"}"?`)) return;
    try {
      // Backend real:
      // await service.delete(`nota/${note.id}`);

      // Mock
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
    } catch (e) {
      console.error("Erro ao excluir nota:", e);
    }
  };

  const handleTogglePin = async (note) => {
    try {
      const updated = { ...note, pinned: !note.pinned };
      // Backend real:
      // await service.put(`nota/${note.id}`, updated);
      setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
    } catch (e) {
      console.error("Erro ao fixar/desafixar:", e);
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

  // Filtro + Ordenação + Busca
  const onSearch = useMemo(() => debounce((v) => setQuery(v), 250), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let arr = [...notes];

    if (onlyPinned) arr = arr.filter((n) => n.pinned);

    if (q) {
      arr = arr.filter((n) =>
        (n.title || "").toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q)
      );
    }

    if (order === "newest") arr.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (order === "oldest") arr.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (order === "title") arr.sort((a, b) => (a.title || "").localeCompare(b.title || ""));

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
          <h1 className="text-xl sm:text-2xl font-bold text-brand-800">Notas</h1>
          <p className="text-sm text-slate-500">Capture ideias, lembretes e pontos para consultas.</p>
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
          <div className="text-center py-16 text-brand-600">Carregando notas…</div>
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
              />)
            )}
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
        title={editing ? "Editar nota" : "Nova nota"}
      >
        <NoteForm
          initial={editing}
          loading={saving}
          onSubmit={(payload) => (editing ? handleUpdate(payload) : handleCreate(payload))}
        />
      </Modal>
    </div>
  );
}

export default Notas