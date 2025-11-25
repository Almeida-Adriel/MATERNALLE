import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// material-ui
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider } from '@mui/material/styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

// utilitários
import Auth from '../utils/service/Auth';
import Service from '../utils/service/Service';
import mascaraCPF from '../utils/mascaras/mascaraCPF';
import mascaraTel from '../utils/mascaras/mascaraTel';
import customTheme from '../utils/CustomTheme';
import { tipoPerfil } from '../utils/enum/tipoPerfil';
import { statusMaternidadeEnum } from '../utils/enum/statusMaternidade';
import { tipoParto } from '../utils/enum/tipoParto';
import { genero } from '../utils/enum/genero';

const service = new Service();
const auth = new Auth();

const Cadastro = () => {
  const navigate = useNavigate();
  const keyStatus = Object.keys(statusMaternidadeEnum);

  const [statusMaternidade, setStatusMaternidade] = useState(keyStatus[1]);

  const [form, setForm] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
    senha: '',
    confirmarSenha: '',
    dpp: '',
  });

  const [filhos, setFilhos] = useState([
    {
      nome: '',
      dataNascimento: '',
      cpf: '',
      pesoNascimento: '',
      tipoParto: Object.keys(tipoParto)[0],
      genero: Object.keys(genero)[2],
    },
  ]);

  const [perfil, setPerfil] = useState({
    tipoPerfil: sessionStorage.getItem('plano') || tipoPerfil.BASICO,
    role: 'CLIENTE',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilhoChange = (index, field, value) => {
    setFilhos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleFilhoDetalheChange = (index, field, value) => {
    setFilhos((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addFilho = () => {
    setFilhos((prev) => [
      ...prev,
      {
        nome: '',
        dataNascimento: '',
        cpf: '',
        pesoNascimento: '',
        tipoParto: tipoParto.NORMAL,
        genero: genero.NAO_INFORMADO,
      },
    ]);
  };

  const removeFilho = (index) => {
    setFilhos((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (
      !form.nome ||
      !form.email ||
      !form.telefone ||
      !form.endereco ||
      !form.dataNascimento ||
      !form.senha ||
      !form.confirmarSenha
    ) {
      return 'Por favor, preencha todos os campos obrigatórios.';
    }
    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    if (!emailOk) return 'Informe um e-mail válido.';
    if (form.senha.length < 6)
      return 'A senha deve ter pelo menos 6 caracteres.';
    if (form.senha !== form.confirmarSenha) return 'As senhas não conferem.';

    if (statusMaternidade === keyStatus[1] && !form.dpp) {
      return 'Informe a Data Prevista do Parto (DPP).';
    }

    const filhosPreenchidos = filhos.filter(
      (f) => f.nome || f.dataNascimento || f.cpf
    );

    if (statusMaternidade === keyStatus[2] && filhosPreenchidos.length === 0) {
      return 'Por favor, adicione e preencha a data de nascimento do seu bebê.';
    }

    // Se o usuário preencheu algum campo de um filho, exige ambos
    for (let i = 0; i < filhos.length; i++) {
      const f = filhos[i];
      const algumPreenchido =
        (f.cpf && f.cpf.trim() !== '') ||
        (f.nome && f.nome.trim() !== '') ||
        (f.dataNascimento && f.dataNascimento !== '');
      const ambosPreenchidos =
        f.cpf &&
        f.cpf.trim() !== '' &&
        f.nome &&
        f.nome.trim() !== '' &&
        f.dataNascimento &&
        f.dataNascimento !== '';
      if (algumPreenchido && !ambosPreenchidos) {
        return `No filho ${i + 1}, preencha todos os campos.`;
      }
      if (statusMaternidade === keyStatus[2] && f.nome && !f.dataNascimento) {
        return `A Data de Nascimento do filho ${i + 1} é obrigatória para o acompanhamento pós-parto.`;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const filhosPayload = filhos
        .filter((f) => f.nome && f.dataNascimento)
        .map((f) => ({
          cpf: f.cpf.trim(),
          nome: f.nome.trim(),
          data_nascimento: f.dataNascimento,
          peso_nascimento:
            statusMaternidade === keyStatus[2]
              ? parseFloat(f.pesoNascimento)
              : null,
          tipo_parto: statusMaternidade === keyStatus[2] ? f.tipoParto : null,
          genero: statusMaternidade === keyStatus[2] ? f.genero : null,
        }));

      const payload = {
        nome: form.nome,
        email: form.email,
        cpf: form.cpf,
        telefone: form.telefone,
        endereco: form.endereco,
        data_nascimento: form.dataNascimento,
        password: form.senha,
        confirmPassword: form.confirmarSenha,
        role,
        perfil: {
          tipoPerfil: perfil.tipoPerfil,
        },
        status_maternidade: statusMaternidade,
        dpp: statusMaternidade === keyStatus[1] ? form.dpp : null,
        filhos: filhosPayload,
      };

      const response = await service.post('/auth/register', payload);

      if (response?.data) {
        auth.saveDataLogin(response.data);
      }

      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => {
        navigate('/login', { replace: true });
        sessionStorage.removeItem('plano');
      }, 400);
    } catch (err) {
      const errorMessage =
        typeof err === 'object' && err !== null && err.error
          ? err.error
          : 'Erro ao realizar cadastro. Tente novamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-brand-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
          <h2 className="text-center text-3xl font-semibold text-brand-700 mb-6">
            Cadastro
          </h2>
          <form onSubmit={handleSubmit}>
            {(error || success) && (
              <Stack sx={{ width: '100%', mb: 2 }} spacing={2}>
                {error && (
                  <Alert
                    variant="outlined"
                    severity="error"
                    onClose={() => setError('')}
                  >
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert
                    variant="outlined"
                    severity="success"
                    onClose={() => setSuccess('')}
                  >
                    {success}
                  </Alert>
                )}
              </Stack>
            )}
            {/* Dados do responsável */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                label="Nome completo"
                fullWidth
                value={form.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
                color="primary"
                autoComplete="name"
              />
              <TextField
                label="E-mail"
                type="email"
                fullWidth
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                color="primary"
                autoComplete="email"
              />
              <TextField
                label="CPF"
                type="text"
                fullWidth
                value={form.cpf}
                onChange={(e) =>
                  handleChange('cpf', mascaraCPF(e.target.value))
                }
                required
                color="primary"
                autoComplete="cpf"
              />
              <TextField
                label="Telefone"
                type="tel"
                fullWidth
                value={form.telefone}
                onChange={(e) =>
                  handleChange('telefone', mascaraTel(e.target.value))
                }
                required
                color="primary"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
              />
              <TextField
                label="Endereço"
                fullWidth
                value={form.endereco}
                onChange={(e) => handleChange('endereco', e.target.value)}
                required
                color="primary"
                autoComplete="street-address"
              />
              <TextField
                label="Data de nascimento"
                type="date"
                fullWidth
                value={form.dataNascimento}
                onChange={(e) => handleChange('dataNascimento', e.target.value)}
                required
                color="primary"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                label="Senha"
                type="password"
                fullWidth
                value={form.senha}
                onChange={(e) => handleChange('senha', e.target.value)}
                required
                color="primary"
                autoComplete="new-password"
              />
              <TextField
                label="Confirmar senha"
                type="password"
                fullWidth
                value={form.confirmarSenha}
                onChange={(e) => handleChange('confirmarSenha', e.target.value)}
                required
                color="primary"
                autoComplete="new-password"
              />
            </div>
            {/* SELEÇÃO DE STATUS DE MATERNIDADE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <TextField
                select
                label="Escolha seu Status de Maternidade"
                fullWidth
                value={statusMaternidade}
                onChange={(e) => setStatusMaternidade(e.target.value)}
                required
                color="primary"
              >
                {Object.entries(statusMaternidadeEnum).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Escolha o plano"
                fullWidth
                value={perfil.tipoPerfil}
                onChange={(e) =>
                  setPerfil({ ...perfil, tipoPerfil: e.target.value })
                }
                required
                color="primary"
              >
                {Object.entries(tipoPerfil).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            {/* CAMPO CONDICIONAL: GESTANTE (DPP) */}
            {statusMaternidade === Object.keys(statusMaternidadeEnum)[1] && (
              <div className="mb-6 border-l-4 border-brand-500 pl-4 py-2 bg-brand-50/50">
                <h3 className="text-lg font-semibold text-brand-700 mb-3">
                  Informação de Gestação
                </h3>
                <TextField
                  label="Data Prevista do Parto (DPP)"
                  type="date"
                  fullWidth
                  value={form.dpp}
                  onChange={(e) => handleChange('dpp', e.target.value)}
                  required={statusMaternidade === keyStatus[1]}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                  color="primary"
                />
              </div>
            )}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-brand-700">
                Informações sobre o(s) filho(s)
              </h3>
              {statusMaternidade !== keyStatus[1] && (
                <Button
                  type="button"
                  variant="outlined"
                  startIcon={<AddCircleOutlineIcon />}
                  onClick={addFilho}
                >
                  Adicionar filho(a)
                </Button>
              )}
            </div>
            <div className="space-y-3 mb-6">
              {filhos.map((filho, idx) => (
                <div
                  key={idx}
                  className={`border-b border-brand-200 p-2 pb-4 rounded-2xl`}
                >
                  <div className="flex gap-3 items-center mb-3">
                    <TextField
                      label="CPF"
                      fullWidth
                      value={filho.cpf}
                      onChange={(e) =>
                        handleFilhoChange(
                          idx,
                          'cpf',
                          mascaraCPF(e.target.value)
                        )
                      }
                      color="primary"
                      sx={{ width: '300px' }}
                    />
                    <TextField
                      label={`Nome do filho(a) ${idx + 1}`}
                      fullWidth
                      value={filho.nome}
                      onChange={(e) =>
                        handleFilhoChange(idx, 'nome', e.target.value)
                      }
                      color="primary"
                      sx={{ width: '470px' }}
                    />
                    <TextField
                      label="Data de nascimento"
                      type="date"
                      value={filho.dataNascimento}
                      onChange={(e) =>
                        handleFilhoChange(idx, 'dataNascimento', e.target.value)
                      }
                      color="primary"
                      slotProps={{
                        inputLabel: { shrink: true },
                      }}
                    />
                    {filhos.length > 1 && (
                      <IconButton
                        aria-label="remover"
                        onClick={() => removeFilho(idx)}
                        className="justify-self-start"
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    )}
                  </div>
                  {/* CAMPOS CONDICIONAIS: PUERPERA (Detalhes do Bebê) */} 
                  {statusMaternidade === keyStatus[2] && (
                    <div className="grid grid-cols-3 gap-3 pt-3 mt-3">
                      <TextField
                        label="Peso ao Nascer (kg)"
                        type="number"
                        fullWidth
                        value={filho.pesoNascimento}
                        onChange={(e) =>
                          handleFilhoDetalheChange(
                            idx,
                            'pesoNascimento',
                            e.target.value
                          )
                        }
                        color="primary"
                      />
                      <TextField
                        select
                        label="Tipo de Parto"
                        fullWidth
                        value={filho.tipoParto}
                        onChange={(e) =>
                          handleFilhoDetalheChange(
                            idx,
                            'tipoParto',
                            e.target.value
                          )
                        }
                        color="primary"
                      >
                        {Object.entries(tipoParto).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        select
                        label="Gênero do Bebê"
                        fullWidth
                        value={filho.genero}
                        onChange={(e) =>
                          handleFilhoDetalheChange(
                            idx,
                            'genero',
                            e.target.value
                          )
                        }
                        color="primary"
                      >
                        {Object.entries(genero).map(([value, label]) => (
                          <MenuItem key={value} value={value}>
                            {label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <Button
              type="submit"
              className="w-full p-3 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-800"
              variant="contained"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
          <div className="text-center pt-4">
            <Link
              to="/login"
              className="text-sm text-brand-600 hover:text-brand-800 transition duration-150"
            >
              Já tem conta? Entrar
            </Link>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Cadastro;
