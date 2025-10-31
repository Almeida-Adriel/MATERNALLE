import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import { ThemeProvider } from "@mui/material/styles";
import customTheme from "../utils/CustomTheme";
import Service from "../utils/service/Service";
import Auth from "../utils/service/Auth";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import mascaraCPF from '../utils/mascaras/mascaraCPF'
import mascaraTel from '../utils/mascaras/mascaraTel'
import { tipoPerfil } from "../utils/enum/tipoPerfil";
import MenuItem from "@mui/material/MenuItem";

const service = new Service();
const auth = new Auth();

const Cadastro = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    endereco: "",
    dataNascimento: "",
    senha: "",
    confirmarSenha: "",
  });

  const [filhos, setFilhos] = useState([
    { nome: "", dataNascimento: "", cpf: "" },
  ]);

  const [perfil, setPerfil] = useState({
    tipoPerfil: sessionStorage.getItem("plano"),
    role: "CLIENTE",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  const addFilho = () => {
    setFilhos((prev) => [...prev, { nome: "", dataNascimento: "", cpf: "" }]);
  };

  const removeFilho = (index) => {
    setFilhos((prev) => prev.filter((_, i) => i !== index));
  };

  const validate = () => {
    if (!form.nome || !form.email || !form.telefone || !form.endereco || !form.dataNascimento || !form.senha || !form.confirmarSenha) {
      return "Por favor, preencha todos os campos obrigatórios.";
    }
    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    if (!emailOk) return "Informe um e-mail válido.";
    if (form.senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (form.senha !== form.confirmarSenha) return "As senhas não conferem.";

    // Se o usuário preencheu algum campo de um filho, exige ambos
    for (let i = 0; i < filhos.length; i++) {
      const f = filhos[i];
      const algumPreenchido = (f.cpf && f.cpf.trim() !== "") || (f.nome && f.nome.trim() !== "") || (f.dataNascimento && f.dataNascimento !== "");
      const ambosPreenchidos = f.cpf && f.cpf.trim() !== "" && f.nome && f.nome.trim() !== "" && f.dataNascimento && f.dataNascimento !== "";
      if (algumPreenchido && !ambosPreenchidos) {
        return `No filho ${i + 1}, preencha todos os campos.`;
      }
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        nome: form.nome,
        email: form.email,
        cpf: form.cpf,
        telefone: form.telefone,
        endereco: form.endereco,
        data_nascimento: form.dataNascimento,
        password: form.senha,
        confirmPassword: form.confirmarSenha,
        perfil: {
          tipoPerfil: perfil.tipoPerfil,
          role: perfil.role
        },
        filhos: filhos
          .filter((f) => f.nome && f.dataNascimento)
          .map((f) => ({ cpf: f.cpf.trim(), nome: f.nome.trim(), data_nascimento: f.dataNascimento })),
      };

      const response = await service.post("/auth/register", payload);

      if (response?.data) {
        auth.saveDataLogin(response.data);
      }

      setSuccess("Cadastro realizado com sucesso!");
      setTimeout(() => {
        navigate("/login", { replace: true });
        sessionStorage.removeItem("plano");
      }, 400);
    } catch (err) {
      const errorMessage =
        typeof err === "object" && err !== null && err.error
          ? err.error
          : "Erro ao realizar cadastro. Tente novamente.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={customTheme}>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-brand-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
          <h2 className="text-center text-3xl font-semibold text-brand-700 mb-6">
            Cadastro
          </h2>

          <form onSubmit={handleSubmit}>
            {(error || success) && (
              <Stack sx={{ width: "100%", mb: 2 }} spacing={2}>
                {error && (
                  <Alert
                    variant="outlined"
                    severity="error"
                    onClose={() => setError("")}
                  >
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert
                    variant="outlined"
                    severity="success"
                    onClose={() => setSuccess("")}
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
                onChange={(e) => handleChange("nome", e.target.value)}
                required
                color="primary"
                autoComplete="name"
              />
              <TextField
                label="E-mail"
                type="email"
                fullWidth
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                color="primary"
                autoComplete="email"
              />
              <TextField
                label="CPF"
                type="text"
                fullWidth
                value={form.cpf}
                onChange={(e) => handleChange("cpf", mascaraCPF(e.target.value))}
                required
                color="primary"
                autoComplete="cpf"
              />
              <TextField
                label="Telefone"
                type="tel" 
                fullWidth
                value={form.telefone}
                onChange={(e) => handleChange("telefone", mascaraTel(e.target.value))}
                required
                color="primary"
                autoComplete="tel"
                placeholder="(00) 00000-0000"
              />
              <TextField
                label="Endereço"
                fullWidth
                value={form.endereco}
                onChange={(e) => handleChange("endereco", e.target.value)}
                required
                color="primary"
                autoComplete="street-address"
              />
              <TextField
                label="Data de nascimento"
                type="date"
                fullWidth
                value={form.dataNascimento}
                onChange={(e) => handleChange("dataNascimento", e.target.value)}
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
                onChange={(e) => handleChange("senha", e.target.value)}
                required
                color="primary"
                autoComplete="new-password"
              />
              <TextField
                label="Confirmar senha"
                type="password"
                fullWidth
                value={form.confirmarSenha}
                onChange={(e) => handleChange("confirmarSenha", e.target.value)}
                required
                color="primary"
                autoComplete="new-password"
              />
            </div>

            <div className="mb-4">
              <TextField
                select
                label="Escolha o plano"
                fullWidth
                value={perfil.tipoPerfil}
                onChange={(e) => setPerfil({ ...perfil, tipoPerfil: e.target.value })}
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

            {/* Filhos */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-brand-700">
                Filho(a)
              </h3>
              <Button
                type="button"
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={addFilho}
              >
                Adicionar filho(a)
              </Button>
            </div>

            <div className="space-y-3 mb-6">
              {filhos.map((filho, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 items-center"
                >
                  <TextField
                    label="CPF"
                    fullWidth
                    value={filho.cpf}
                    onChange={(e) =>
                      handleFilhoChange(idx, "cpf", mascaraCPF(e.target.value))
                    }
                    color="primary"
                    sx={{ width: "250px" }}
                  />
                  <TextField
                    label={`Nome do filho(a) ${idx + 1}`}
                    fullWidth
                    value={filho.nome}
                    onChange={(e) =>
                      handleFilhoChange(idx, "nome", e.target.value)
                    }
                    color="primary"
                    sx={{ width: "400px"}}
                  />
                  <TextField
                    label="Data de nascimento"
                    type="date"
                    value={filho.dataNascimento}
                    onChange={(e) =>
                      handleFilhoChange(idx, "dataNascimento", e.target.value)
                    }
                    color="primary"
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                  <IconButton
                    aria-label="remover"
                    onClick={() => removeFilho(idx)}
                    disabled={filhos.length === 1 && !filhos[0].nome && !filhos[0].dataNascimento}
                    className="justify-self-start"
                  >
                    <DeleteOutlineIcon />
                  </IconButton>
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full p-3 bg-brand-700 text-white font-semibold rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-800"
              variant="contained"
              disabled={loading}
            >
              {loading ? "Cadastrando..." : "Cadastrar"}
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