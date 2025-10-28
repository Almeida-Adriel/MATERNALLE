import React, { useState } from "react";
import { TextField, Button, Alert, Stack } from "@mui/material";
import Service from "../utils/service/Service";
import mascaraCPF from "../utils/mascaras/mascaraCPF"
import customTheme from '../utils/CustomTheme';
import { ThemeProvider } from '@mui/material/styles';

const esqueciMinhaSenha = () => {
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const service = new Service();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("O e-mail é obrigatório.");
            return;
        }
        if (!cpf) {
            setError("O CPF é obrigatório.");
            return;
        }

        setLoading(true);

        try {
            const payload = { email, cpf };
            const response = await service.post("/auth/forgot-password", payload);

            if (response?.data) {
                setMessage("Um código de 5 dígitos foi enviado para seu e-mail.");
            }
        } catch (err) {
            setError("Erro ao enviar o código. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider theme={customTheme}>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-brand-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-center text-3xl font-semibold text-brand-700 mb-6">Esqueci Minha Senha</h2>

                    <form onSubmit={handleSubmit}>
                        {(error || message) && (
                            <Stack sx={{ width: "100%", mb: 2 }} spacing={2}>
                                {error && (
                                    <Alert variant="outlined" severity="error" onClose={() => setError("")}>
                                        {error}
                                    </Alert>
                                )}
                                {message && (
                                    <Alert variant="outlined" severity="success" onClose={() => setMessage("")}>
                                        {message}
                                    </Alert>
                                )}
                            </Stack>
                        )}

                        <TextField
                            label="E-mail"
                            type="email"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            color="primary"
                            autoComplete="email"
                            margin="normal"
                        />
                        <TextField
                            label="CPF"
                            type="text"
                            fullWidth
                            value={cpf}
                            onChange={(e) => setCpf(mascaraCPF(e.target.value))}
                            required
                            color="primary"
                            autoComplete="cpf"
                            margin="normal"
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? "Enviando..." : "Enviar Código"}
                        </Button>
                    </form>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default esqueciMinhaSenha;