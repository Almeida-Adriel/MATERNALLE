import React, { useState, useEffect } from 'react';
import DefaultDataPage from '../../components/DefaultDataPage';
import Modal from '../../components/Modal';

import Service from '../../utils/service/Service';
import customTheme from '../../utils/CustomTheme';
import mascaraCpf from '../../utils/mascaras/mascaraCPF';
import mascaraTelefone from '../../utils/mascaras/mascaraTel';

import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from 'notistack';
import { ThemeProvider } from '@mui/material/styles';
import {
  MdOutlineDelete,
  MdOutlineCreate,
  MdOutlinePersonOutline,
} from 'react-icons/md';

const service = new Service();
const endpoint = '/usuarios';

const Usuarios = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formMessage, setFormMessage] = useState('');
  const [formMessageType, setFormMessageType] = useState('error');

  const initialFormState = {
    nome: '',
    cpf: '',
    email: '',
    data_nascimento: '',
    telefone: '',
    endereco: '',
    status_maternidade: 'NENHUMA',
    dpp: '',
    password: '',
    confirmPassword: '',
    role: 'CLIENTE',
    perfil: {
      tipoPerfil: '',
      data_expiracao: '',
    },
  };
  const [formData, setFormData] = useState(initialFormState);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      return '';
    }
  };

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'cpf'
          ? mascaraCpf(value)
          : name === 'telefone'
            ? mascaraTelefone(value)
            : value,
      perfil: { ...prev.perfil, tipoPerfil: null }
    }));
  };

  const handlePerfilChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      perfil: { ...prev.perfil, [name]: value },
    }));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleOpenCreate = () => {
    resetForm();
    setOpenModal(true);
  };

  const clearFormMessage = () => {
    setFormMessage('');
    setFormMessageType('error');
  };

  const resetForm = () => {
    setFormData(initialFormState);
    clearFormMessage();
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      nome: item.nome || '',
      cpf: mascaraCpf(item.cpf) || '',
      email: item.email || '',
      data_nascimento: formatDateForInput(item.data_nascimento) || '',
      telefone: mascaraTelefone(item.telefone) || '',
      endereco: item.endereco || '',
      status_maternidade: item.status_maternidade || 'NENHUMA',
      dpp: formatDateForInput(item.dpp),
      password: '',
      confirmPassword: '',
      role: item.role || 'CLIENTE',
      perfil: {
        tipoPerfil: item.perfil?.tipoPerfil || 'BASICO',
      },
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
      await service.delete(endpoint, id);

      enqueueSnackbar('Usuário deletado com sucesso!', { variant: 'success' });

      await fetchUsuarios();
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao deletar usuário.';
      enqueueSnackbar(msg, { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    setIsLoading(true);
    try {
      const res = await service.getWithParams(`${endpoint}/todos`, {
        search: query,
        page: currentPage,
      });

      const { usuarios, pagination } = res.data;
      setUsuarios(usuarios || []);
      setTotalPages(Number(pagination?.totalPages) || 1);
      setCurrentPage(Number(pagination?.currentPage) || 1);
    } catch (error) {
      enqueueSnackbar('Erro ao buscar usuários.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [query, currentPage]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    clearFormMessage();
    setIsLoading(true);

    if (formData.status_maternidade === 'GESTANTE' && !formData.dpp) {
      setFormMessage('Data prevista do parto é obrigatória para gestantes.');
      setFormMessageType('error');
      setIsLoading(false);
      return;
    }

    if (!editingId) {
      if (!formData.password || !formData.confirmPassword) {
        setFormMessage('Senha é obrigatória para novos usuários.');
        setFormMessageType('error');
        setIsLoading(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setFormMessage('As senhas não conferem.');
        setFormMessageType('error');
        setIsLoading(false);
        return;
      }
    }

    const payload = {
      ...formData,
      data_nascimento: formData.data_nascimento
        ? new Date(formData.data_nascimento).toISOString()
        : null,
      dpp: formData.dpp ? new Date(formData.dpp).toISOString() : null,
      perfil: {
        ...formData.perfil,
      },
    };

    if (editingId && !payload.password) {
      delete payload.password;
      delete payload.confirmPassword;
    }

    try {
      if (editingId) {
        await service.put(`${endpoint}/${editingId}`, payload);
        enqueueSnackbar('Usuário atualizado com sucesso!', {
          variant: 'success',
        });
      } else {
        const res = await service.post(endpoint, payload);
        const primerioNome = res.data.usario.nome.split(' ');
        enqueueSnackbar(`Criação de usuário ${primerioNome}.`, {
          variant: 'success',
        });
      }
      setOpenModal(false);
      resetForm();
      await fetchUsuarios();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'Erro ao salvar usuário.';
      setFormMessage(msg);
      setFormMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    { key: 'nome', header: 'Nome', width: 550 },
    {
      key: 'role',
      header: 'Permissão',
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            item.role === 'ADMIN'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {item.role || '-'}
        </span>
      ),
    },
    {
      key: 'tipoPerfil',
      header: 'Plano',
      render: (item) => item.perfil?.tipoPerfil || 'Sem Plano',
    },
    {
      key: 'acoes',
      header: 'Ações',
      align: 'center',
      width: 120,
      render: (item) => (
        <div className="flex justify-center gap-2">
          <button
            className="text-blue-800 bg-blue-50 border border-blue-200 p-1.5 rounded-md hover:bg-blue-100 transition cursor-pointer"
            onClick={() => handleEdit(item)}
            title="Editar"
          >
            <MdOutlineCreate size={18} />
          </button>
          <button
            className="text-red-600 bg-red-50 border border-red-200 p-1.5 rounded-md hover:bg-red-100 transition cursor-pointer"
            onClick={() => handleDelete(item.id)}
            title="Excluir"
          >
            <MdOutlineDelete size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <ThemeProvider theme={customTheme} className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-brand-50 text-brand-600 border border-brand-100">
          <MdOutlinePersonOutline size={26} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-brand-800">
            Controle de usuários
          </h1>
          <p className="text-sm text-slate-500">
            Crie novos usuários e defina seu nível de acesso.
          </p>
        </div>
      </div>
      {openModal && (
        <Modal 
          open={openModal}
          onClose={() => {
            setOpenModal(false)
            setEditingId(null)
          }}
          title={editingId ? 'Editar Usuário' : 'Novo Usuário'}
        >
          {formMessage && (
            <Stack sx={{ width: '100%', mb: 3 }}>
              <Alert severity={formMessageType} onClose={clearFormMessage}>
                {formMessage}
              </Alert>
            </Stack>
          )}
          <form
            id="userForm"
            onSubmit={handleFormSubmit}
            className="space-y-1"
          >
            {/* Dados Pessoais */}
            <div className="p-4">
              <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-4">
                Dados Pessoais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  label="Nome Completo"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="CPF"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Telefone"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Data de Nascimento"
                  name="data_nascimento"
                  type="date"
                  value={formData.data_nascimento}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Endereço"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                />
                {(!editingId ||
                  (editingId &&
                    (formData.password || formData.confirmPassword))) && (
                    <>
                      <TextField
                        label="Senha"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        required={!editingId}
                      />
                      <TextField
                        label="Confirmar Senha"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        required={!editingId}
                      />
                    </>
                )}
              </div>
            </div>

            {/* Acesso */}
            <div className="p-4">
              <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-4">
                Acesso e Plano
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextField
                  select
                  label="Permissão (Role)"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  fullWidth
                  size="small"
                >
                  <MenuItem value="CLIENTE">Cliente</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </TextField>
                {formData.role !== 'ADMIN' &&
                  <TextField
                    select
                    label="Tipo de Perfil"
                    name="tipoPerfil"
                    value={formData.perfil.tipoPerfil}
                    onChange={handlePerfilChange}
                    required
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="BASICO">Básico</MenuItem>
                    <MenuItem value="PREMIUM">Premium</MenuItem>
                    <MenuItem value="PREMIUM_ANUAL">Premium Anual</MenuItem>
                  </TextField>
                }
              </div>
            </div>

            {/* Maternidade */}
            {formData.role !== 'ADMIN' &&
              <div className="p-4">
                <h3 className="text-sm font-bold text-brand-600 uppercase tracking-wider mb-4">
                  Maternidade
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextField
                    select
                    label="Status Maternidade"
                    name="status_maternidade"
                    value={formData.status_maternidade}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="NENHUMA">Nenhuma</MenuItem>
                    <MenuItem value="GESTANTE">Gestante</MenuItem>
                    <MenuItem value="PUERPERA">Puérpera</MenuItem>
                  </TextField>

                  {formData.status_maternidade === 'GESTANTE' && (
                    <TextField
                      label="Data Prevista do Parto (DPP)"
                      name="dpp"
                      type="date"
                      value={formData.dpp}
                      onChange={handleChange}
                      required
                      fullWidth
                      size="small"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                </div>
              </div>
            }
          </form>
          <div className="p-6 flex justify-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
              disabled={isLoading}
            >
              {isLoading
                ? 'Salvando...'
                : editingId
                  ? 'Atualizar Usuário'
                  : 'Criar Usuário'}
            </Button>
          </div>
        </Modal>
      )}
      <DefaultDataPage
        labelButton={'Adicionar Usuário'}
        currentPage={currentPage}
        totalPages={totalPages}
        dataList={usuarios}
        query={query}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onOpenCreate={handleOpenCreate}
        loading={isLoading}
        columns={columns}
      />
    </ThemeProvider>
  );
};

export default Usuarios;
