import React, { useState } from "react";
import { TextField, Button, Alert, Stack } from "@mui/material";
import Service from "../utils/service/Service";
import mascaraCPF from "../utils/mascaras/mascaraCPF"
import customTheme from '../utils/CustomTheme';
import { ThemeProvider } from '@mui/material/styles';

// Definindo os passos da recuperação de senha
const STEPS = {
    SEND_CODE: 1,
    VALIDATE_AND_RESET: 2,
    SUCCESS: 3,
};

const EsqueciMinhaSenha = () => {
    const [step, setStep] = useState(STEPS.SEND_CODE); // Controle da tela
    
    // Campos do Step 1 (Envio)
    const [email, setEmail] = useState("");
    const [cpf, setCpf] = useState("");
    
    // Campos do Step 2 (Validação/Nova Senha)
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    
    // Status e Utilidades
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const service = new Service();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!email || !cpf) {
            setError("E-mail e CPF são obrigatórios.");
            return;
        }

        setLoading(true);

        try {
            const payload = { email, cpf };
            await service.post("/auth/forgot-password", payload);

            setMessage("Código de 5 dígitos enviado para seu e-mail. Por favor, verifique sua caixa de entrada.");
            setStep(STEPS.VALIDATE_AND_RESET);
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Erro ao enviar o código. Tente novamente.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!code || !newPassword || !confirmNewPassword) {
            setError("Todos os campos são obrigatórios.");
            return;
        }

        if (newPassword.length < 6) {
            setError("A nova senha deve ter pelo menos 6 caracteres.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError("A nova senha e a confirmação de senha não coincidem.");
            return;
        }

        setLoading(true);

        try {
            const payload = { 
                cpf, 
                code, 
                newPassword 
            };
            
            await service.post("/auth/reset-password", payload);

            setMessage("Senha alterada com sucesso! Você será redirecionado em breve.");
            setStep(STEPS.SUCCESS);
            
            setTimeout(() => {
                <Alert variant="outlined" severity="success" onClose={() => setMessage("")}>
                    {message}
                </Alert>
                window.location.href = '/login'; 
            }, 3000);

        } catch (err) {
            const errorMessage = err.response?.data?.error || "Erro ao alterar a senha. Verifique o código e tente novamente.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // --- Renderização do Conteúdo (Passo 1) ---
    const renderSendCodeForm = () => (
        <form onSubmit={handleSendCode}>
            <TextField
                label="E-mail"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                color="primary"
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
                margin="normal"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? "Enviando..." : "Enviar Código"}
            </Button>
        </form>
    );

    const renderValidateAndResetForm = () => (
        <form onSubmit={handleResetPassword}>
            <p className="text-sm text-center text-gray-500 mb-4">
                Digite o código de 5 dígitos enviado para <strong className="text-brand-700">{email}</strong>.
            </p>
            <TextField
                label="Código de Recuperação (5 dígitos)"
                type="text"
                fullWidth
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 5))}
                required
                color="primary"
                margin="normal"
            />
            <TextField
                label="Nova Senha"
                type="password"
                fullWidth
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                color="primary"
                margin="normal"
            />
            <TextField
                label="Confirme a Nova Senha"
                type="password"
                fullWidth
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
                color="primary"
                margin="normal"
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
            >
                {loading ? "Alterando..." : "Alterar Senha"}
            </Button>
            <Button
                variant="text"
                color="primary"
                fullWidth
                onClick={() => setStep(STEPS.SEND_CODE)}
                sx={{ mt: 1 }}
            >
                Voltar e Reenviar Código
            </Button>
        </form>
    );
    
    const renderSuccessMessage = () => (
        <div className="text-center">
            <h3 className="text-2xl font-semibold text-green-600 mb-4">Sucesso!</h3>
            <p className="text-gray-700">Sua senha foi alterada com sucesso. Você será redirecionado para o login em instantes.</p>
        </div>
    );

    const renderFormByStep = () => {
        switch (step) {
            case STEPS.VALIDATE_AND_RESET:
                return renderValidateAndResetForm();
            case STEPS.SUCCESS:
                return renderSuccessMessage();
            case STEPS.SEND_CODE:
            default:
                return renderSendCodeForm();
        }
    };


    return (
        <ThemeProvider theme={customTheme}>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-brand-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-center text-3xl font-semibold text-brand-700 mb-6">
                        {step === STEPS.SEND_CODE ? "Esqueci Minha Senha" : "Redefinir Senha"}
                    </h2>

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

                    {renderFormByStep()}
                </div>
            </div>
        </ThemeProvider>
    );
};

export default EsqueciMinhaSenha;