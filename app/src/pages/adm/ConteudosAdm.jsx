import React, { useState } from 'react';
import Service from '../../utils/service/Service';
import { MdOutlineUploadFile, MdOutlineLink } from 'react-icons/md';
import { ThemeProvider } from '@mui/material/styles';
import customTheme from '../../utils/CustomTheme';

const service = new Service();
const ENDPOINT = '/conteudos'; // Mantém o endpoint para clareza

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
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
  };

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

    // 1. Validação simples (Campos obrigatórios)
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

    // 2. Formata os dados
    const dataToSend = {
      ...formData,
      // Garante que campos opcionais vazios sejam `null` para consistência.
      link_referencia: formData.link_referencia || null,
      outros: formData.outros || null,
    };

    try {
      // 3. Chamada ao Serviço (Agora simulando o serviço real de banco de dados/API)
      // Nota: o endpoint é passado para o stub apenas para fins de log.
      const response = await service.post(ENDPOINT, dataToSend);

      // 4. Tratamento da resposta
      if (response && response.titulo) {
        showMessage(
          `Conteúdo "${response.titulo}" criado com sucesso! (ID: ${response.id})`,
          'success'
        );
        resetForm(); // Limpa o formulário após o sucesso
      } else {
        showMessage(
          `Falha ao publicar. Resposta do servidor incompleta.`,
          'error'
        );
        console.error('Resposta inesperada:', response);
      }
    } catch (error) {
      // 5. Tratamento de Erros de Requisição ou Serviço
      const errorMessage =
        error?.response?.data?.error ||
        error.message ||
        'Erro de conexão com o Banco de Dados. Verifique o console.';
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
      <div className="flex items-center justify-center mb-2">
        <MdOutlineUploadFile size={30} className="text-brand-500 mr-2" />
        <h1 className="text-3xl font-extrabold text-brand-700 tracking-tight">
          Painel de Publicação
        </h1>
      </div>

      <p className="text-gray-500 mb-8 text-center text-sm">
        Crie novos recursos e defina seu nível de acesso.
      </p>

      {/* Mensagens de Feedback */}
      <div
        className={`mb-4 p-4 rounded-lg text-sm transition duration-300 ease-in-out ${getMessageClasses()}`}
        role="alert"
      >
        {message}
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Detalhes do Conteúdo */}

        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Título <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="titulo"
            // Foco e hover com cores corporativas sutis
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 shadow-inner hover:border-pink-400"
            value={formData.titulo}
            onChange={handleChange}
            placeholder="Ex: Guia Completo de Finanças Pessoais"
            required
          />
        </div>

        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Descrição <span className="text-red-500">*</span>
          </label>
          <textarea
            id="descricao"
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 resize-none shadow-inner hover:border-pink-400"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Descreva o conteúdo em detalhes, incluindo os tópicos abordados."
            required
          ></textarea>
        </div>

        {/* Tipo e Acesso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="tipo_conteudo"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Tipo de Conteúdo <span className="text-red-500">*</span>
            </label>
            <select
              id="tipo_conteudo"
              // Garante que o select tenha o mesmo estilo de foco e hover
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 shadow-inner hover:border-pink-400 appearance-none bg-white"
              value={formData.tipo_conteudo}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Selecione o tipo
              </option>
              <option value="ARTIGO">Artigo</option>
              <option value="VIDEO">Vídeo</option>
              <option value="PODCAST">Podcast</option>
              <option value="EBOOK">Ebook</option>
              <option value="OUTROS">Outros</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="acesso"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Nível de Acesso <span className="text-red-500">*</span>
            </label>
            <select
              id="acesso"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 shadow-inner hover:border-pink-400 appearance-none bg-white"
              value={formData.acesso}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Selecione o nível
              </option>
              <option value="BASICO">Básico (Gratuito)</option>
              <option value="PREMIUM">Premium (Assinantes)</option>
              <option value="PREMIUM_ANUAL">Premium Anual</option>
            </select>
          </div>
        </div>

        {/* Referências Opcionais */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            Referências (Opcional)
          </h3>
        </div>

        <div>
          <label
            htmlFor="link_referencia"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Link de Referência
          </label>
          <input
            type="url"
            id="link_referencia"
            placeholder="https://exemplo.com/recurso"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 shadow-inner hover:border-pink-400"
            value={formData.link_referencia}
            onChange={handleChange}
          />
        </div>

        <div>
          <label
            htmlFor="outros"
            className="block text-sm font-semibold text-gray-700 mb-1"
          >
            Outras Informações (Palavras-chave, Notas)
          </label>
          <input
            type="text"
            id="outros"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 transition duration-150 shadow-inner hover:border-pink-400"
            value={formData.outros}
            onChange={handleChange}
            placeholder="Ex: Finanças, Orçamento, Investimento"
          />
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          className={`mt-8 w-full py-3 px-4 text-white font-bold rounded-xl shadow-lg transition duration-300 ease-in-out transform ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-pink-600 hover:bg-pink-700 focus:ring-4 focus:ring-pink-300 active:bg-pink-800 hover:scale-[1.01]'
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Publicando...
            </div>
          ) : (
            'Publicar Conteúdo'
          )}
        </button>
      </form>
    </ThemeProvider>
  );
};

export default ConteudosAdm;
