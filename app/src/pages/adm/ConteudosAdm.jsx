import React, { useState, useEffect } from 'react';
import { MdOutlineUploadFile } from 'react-icons/md';
import { ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import customTheme from '../../utils/CustomTheme';
import Service from '../../utils/service/Service';
import { tipo_conteudo_enum } from '../../utils/enum/tipoConteudo';
import { tipoPerfil } from '../../utils/enum/tipoPerfil';
import DefaultDataPage from '../../components/DefaultDataPage';

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
  const [order, setOrder] = useState('newest');
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
      setConteudos(res.data.conteudos || []); // A partir da resposta, configurar os conteúdos
      setTotalPages(res.data.totalPages || 1); // Ajustar o total de páginas
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
          `Conteúdo "${response.titulo}" criado com sucesso! (ID: ${response.id})`,
          'success'
        );
        resetForm(); // Limpa o formulário após o sucesso
        setOpenModal(false); 
      } else {
        showMessage(
          `Falha ao publicar. ${response.error}`,
          'error'
        );
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
    <ThemeProvider theme={customTheme}>
      <div className="flex items-center justify-start mb-2">
        <MdOutlineUploadFile size={30} className="text-brand-500 mr-2" />
        <h1 className="text-3xl font-extrabold text-brand-700 tracking-tight">
          Painel de Publicação
        </h1>
      </div>

      <p className="text-gray-500 mb-8 text-sm">
        Crie novos recursos e defina seu nível de acesso.
      </p>

      {/* Mensagens de Feedback */}
      <div
        className={`mb-4 p-4 rounded-lg text-sm transition duration-300 ease-in-out ${getMessageClasses()}`}
        role="alert"
      >
        {message}
      </div>

      {/* Modal de Criação de Conteúdo */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenModal(false)} />
          <div className="relative z-10 w-full max-w-3xl p-6 bg-white rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-brand-700">Criar Conteúdo</h2>
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
                id='descricao'
                label='Descrição'
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
                    name='tipo_conteudo'
                    label='Tipo Conteudo'
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

                <div className='md:col-span-6'>
                  <TextField
                    name='acesso'
                    label='Tipo de Acesso'
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
                {formData.tipo_conteudo === 'OUTROS' &&
                  <div className='md:col-span-6'>
                    <TextField
                      id='outros'
                      label='Outras Informações (Palavras-chave)'
                      value={formData.outros}
                      onChange={handleChange}
                      type='text'
                      fullWidth
                      required={formData.tipo_conteudo === 'OUTROS'}
                    />
                  </div>
                }
                <div className='md:col-span-6'>
                  <TextField
                    id='link_referencia'
                    label='Link de Referência'
                    value={formData.link_referencia}
                    onChange={handleChange}
                    type='text'
                    placeholder='https://fonte.com/recurso'
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
        dataList={conteudos}  // Passando os dados de conteúdo para a lista
        onSearch={handleSearch}
        query={query}
        order={order}
        onOrderChange={handleOrderChange}
        labelButton={"Adicionar Conteúdo"}
        onOpenCreate={() => setOpenModal(true)}
      />
    </ThemeProvider>
  );
};

export default ConteudosAdm;
