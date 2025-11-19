import React, { useState, useEffect } from 'react';
import { MdOutlineUploadFile } from 'react-icons/md';
import { ThemeProvider } from '@mui/material/styles';
import { MdOutlineDelete, MdOutlineCreate } from "react-icons/md";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import DefaultDataPage from '../../components/DefaultDataPage';
import customTheme from '../../utils/CustomTheme';
import Service from '../../utils/service/Service';
import SnackBar from '../../components/SnackBar';
import { tipo_conteudo_enum } from '../../utils/enum/tipoConteudo';
import { tipoPerfil } from '../../utils/enum/tipoPerfil';

const service = new Service();
const ENDPOINT = '/conteudos';

const ConteudosAdm = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo_conteudo: '',
    acesso: '',
    link_referencia: '',
    outros: '',
  });

  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conteudos, setConteudos] = useState([]);
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openModal, setOpenModal] = useState(false);

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

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
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
      setMessage('Erro ao buscar conteúdos');
      setMessageType('error');
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
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showMessage('Publicando conteúdo, aguarde...', 'info');

    if (
      !formData.titulo ||
      !formData.descricao ||
      !formData.tipo_conteudo ||
      !formData.acesso
    ) {
      showMessage(
        'Por favor, preencha todos os campos obrigatórios (*).',
        'error'
      );
      setIsLoading(false);
      return;
    }

    const dataToSend = {
      ...formData,
      link_referencia: formData.link_referencia || null,
      outros: formData.outros || null,
    };

    try {
      const response = await service.post(ENDPOINT, dataToSend);

      if (response && response?.data.titulo) {
        showMessage(
          `Conteúdo "${response.data.titulo}" criado com sucesso! (ID: ${response.data.id})`,
          'success'
        );
        resetForm(); // Limpa o formulário após o sucesso
        setOpenModal(false);

        await fetchConteudos();
      } else {
        showMessage(`Falha ao publicar. ${response.error}`, 'error');
        console.error('Resposta inesperada:', response.data);
      }
    } catch (error) {
      const errorMessage =
        error?.error ||
        'Erro ao publicar o conteúdo. Por favor tente mais tarde.';
      console.error('Erro na requisição:', error);
      showMessage(`Falha na publicação: ${errorMessage}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageClasses = () => {
    switch (messageType) {
      case 'success':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'hidden';
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

      {/* Mensagens de Feedback */}
      <div
        className={` p-4 rounded-lg text-sm transition duration-300 ease-in-out ${getMessageClasses()}`}
        role="alert"
      >
        {message}
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
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        dataList={conteudos}
        onSearch={handleSearch}
        query={query}
        order={order}
        onOrderChange={handleOrderChange}
        labelButton={'Adicionar Conteúdo'}
        onOpenCreate={() => setOpenModal(true)}
        columns={[
          {
            key: 'titulo',
            header: 'Título',
          },
          {
            key: 'descricao',
            header: 'Descrição',
            render: (item) => (
              <span className="line-clamp-2 text-gray-600">
                {item.descricao}
              </span>
            ),
          },
          {
            key: 'acoes',
            header: 'Ações',
            render: (item) => (
              <div className="flex gap-2">
                <button
                  className="text-brand-800 bg-brand-300 border border-brand-300 p-1 rounded-sm hover:bg-brand-200 hover:border-brand-200"
                  onClick={() => handleEdit(item)}
                >
                  <MdOutlineCreate size={23} />
                </button>
                <button
                  className="text-brand-800 bg-red-400 border border-red-400 p-1 rounded-sm hover:bg-red-300 hover:border-red-300"
                  onClick={() => handleDelete(item.id)}
                >
                  <MdOutlineDelete size={23}/>
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
