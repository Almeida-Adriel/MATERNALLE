import React, { useState, useEffect } from 'react';
//componentes
import DefaultDataPage from '../../components/DefaultDataPage';

// utils
import Service from '../../utils/service/Service';
import customTheme from '../../utils/CustomTheme';
import { tipoPerfil } from '../../utils/enum/tipoPerfil';
import { tipo_conteudo_enum } from '../../utils/enum/tipoConteudo';

// materil ui
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { useSnackbar } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import {
  MdOutlineDelete,
  MdOutlineCreate,
  MdOutlineUploadFile,
} from 'react-icons/md';

const service = new Service();
const ENDPOINT = '/conteudos';

const ConteudosAdm = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo_conteudo: '',
    acesso: '',
    link_referencia: '',
    outros: '',
  });
  const [formMessage, setFormMessage] = useState('');
  const [formMessageType, setFormMessageType] = useState('error');
  const [isLoading, setIsLoading] = useState(false);
  const [conteudos, setConteudos] = useState([]);
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setFormData((prev) => ({ ...prev, [id || name]: value }));
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      titulo: item.titulo || '',
      descricao: item.descricao || '',
      tipo_conteudo: item.tipo_conteudo || '',
      acesso: item.acesso || '',
      link_referencia: item.link_referencia || '',
      outros: item.outros || '',
    });
    clearFormMessage();
    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const confirmar = window.confirm(
      'Tem certeza que deseja excluir este conteúdo?'
    );
    if (!confirmar) return;

    try {
      setIsLoading(true);
      const response = await service.delete(`${ENDPOINT}`, `${id}`);

      const msg = response?.data?.message || 'Conteúdo deletado com sucesso.';
      enqueueSnackbar(msg, { variant: 'success' });

      await fetchConteudos();
    } catch (error) {
      console.error('Erro ao deletar conteúdo:', error);
      const errorMessage =
        error?.response?.data?.error ||
        'Erro ao deletar o conteúdo. Tente novamente mais tarde.';
      enqueueSnackbar(errorMessage, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const clearFormMessage = () => {
    setFormMessage('');
    setFormMessageType('error');
  };

  const fetchConteudos = async () => {
    setIsLoading(true);
    try {
      const res = await service.getWithParams(`${ENDPOINT}/todos`, {
        search: query,
        order,
        page: currentPage,
      });
      const { conteudos, pagination } = res.data;

      setConteudos(conteudos || []);

      setTotalPages(Number(pagination?.totalPages) || 1);

      setCurrentPage(Number(pagination?.currentPage) || 1);
    } catch (error) {
      enqueueSnackbar('Erro ao buscar conteúdos', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConteudos();
  }, [query, order, currentPage]);

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      tipo_conteudo: '',
      acesso: '',
      link_referencia: '',
      outros: '',
    });
    clearFormMessage();
    setEditingId(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    clearFormMessage();

    if (
      !formData.titulo ||
      !formData.descricao ||
      !formData.tipo_conteudo ||
      !formData.acesso
    ) {
      setFormMessage('Por favor, preencha todos os campos obrigatórios (*).');
      setFormMessageType('error');
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      link_referencia: formData.link_referencia || null,
      outros: formData.outros || null,
    };

    try {
      let response;

      if (editingId) {
        response = await service.put(`${ENDPOINT}/${editingId}`, dataToSend);
        enqueueSnackbar(`Conteúdo Atualizado com sucesso!`, {
          variant: 'success',
        });
      } else {
        response = await service.post(ENDPOINT, dataToSend);
        enqueueSnackbar(`Conteúdo criado com sucesso!`, { variant: 'success' });
      }
      resetForm(); // Limpa o formulário após o sucesso
      setOpenModal(false);
      await fetchConteudos();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error ||
        'Erro ao publicar o conteúdo. Por favor tente mais tarde.';
      console.error('Erro na requisição:', error);
      setFormMessage(errorMessage);
      setFormMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={customTheme} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
          <MdOutlineUploadFile size={26} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-800">
            Painel de Publicação
          </h1>
          <p className="text-sm text-slate-500">
            Crie novos recursos e defina seu nível de acesso.
          </p>
        </div>
      </div>

      {/* Modal de Criação de Conteúdo */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenModal(false)}
          />
          <div className="relative z-10 w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-brand-700">
              Criar Conteúdo
            </h2>

            {formMessage && (
              <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
                <Alert
                  variant="outlined"
                  severity={formMessageType}
                  onClose={clearFormMessage}
                >
                  {formMessage}
                </Alert>
              </Stack>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-6 mt-4">
              <TextField
                id="titulo"
                label="Título"
                type="text"
                value={formData.titulo}
                onChange={handleChange}
                fullWidth
                required
                sx={{ marginBottom: '16px' }}
              />
              <TextField
                id="descricao"
                label="Descrição"
                value={formData.descricao}
                onChange={handleChange}
                rows={4}
                fullWidth
                multiline
                required
                sx={{ marginBottom: '16px' }}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <TextField
                    name="tipo_conteudo"
                    label="Tipo Conteudo"
                    onChange={handleChange}
                    value={formData.tipo_conteudo}
                    select
                    fullWidth
                    required
                    sx={{ marginBottom: '16px' }}
                  >
                    {Object.entries(tipo_conteudo_enum).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>

                <div className="md:col-span-6">
                  <TextField
                    name="acesso"
                    label="Tipo de Acesso"
                    onChange={handleChange}
                    value={formData.acesso}
                    select
                    fullWidth
                    required
                    sx={{ marginBottom: '16px' }}
                  >
                    {Object.entries(tipoPerfil).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                {formData.tipo_conteudo === 'OUTROS' && (
                  <div className="md:col-span-6">
                    <TextField
                      id="outros"
                      label="Outras Informações (Palavras-chave)"
                      value={formData.outros}
                      onChange={handleChange}
                      type="text"
                      fullWidth
                      required={formData.tipo_conteudo === 'OUTROS'}
                    />
                  </div>
                )}
                <div className="md:col-span-6">
                  <TextField
                    id="link_referencia"
                    label="Link de Referência"
                    value={formData.link_referencia}
                    onChange={handleChange}
                    type="text"
                    placeholder="https://fonte.com/recurso"
                    fullWidth
                  />
                </div>
              </div>

              {/* Botão de Envio */}
              <button
                type="submit"
                className={`w-full py-3 px-4 text-white font-bold rounded-xl shadow-lg transition duration-300 ease-in-out transform ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300 active:bg-pink-800 hover:scale-[1.01]'
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Publicando...' : 'Publicar Conteúdo'}
              </button>
            </form>
          </div>
        </div>
      )}

      <DefaultDataPage
        labelButton={'Adicionar Conteúdo'}
        currentPage={currentPage}
        totalPages={totalPages}
        dataList={conteudos}
        order={order}
        query={query}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onOrderChange={handleOrderChange}
        onOpenCreate={() => {
          resetForm();
          setOpenModal(true);
        }}
        loading={isLoading}
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
            width: 140,
            render: (item) => (
              <div className="flex justify-center gap-2">
                <button
                  className="text-blue-800 bg-blue-50 border border-blue-200 p-1.5 rounded-md hover:bg-blue-100 transition cursor-pointer"
                  onClick={() => handleEdit(item)}
                  title="Editar"
                  aria-label="Editar conteúdo"
                >
                  <MdOutlineCreate size={18} />
                </button>
                <button
                  className="text-red-600 bg-red-50 border border-red-200 p-1.5 rounded-md hover:bg-red-100 transition cursor-pointer"
                  onClick={() => handleDelete(item.id)}
                  title="Excluir"
                  aria-label="Excluir conteúdo"
                >
                  <MdOutlineDelete size={18} />
                </button>
              </div>
            ),
          },
        ]}
      />
    </ThemeProvider>
  );
};

export default ConteudosAdm;
