import transporter from '../utils/mailer.js';
import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import { cpf as cpfValidador } from 'cpf-cnpj-validator';

const generateCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};

const sendEmail = async (email, code) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de Recuperação de Senha',
        text: `Seu código de recuperação é: ${code}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
        throw new Error("Erro ao enviar o e-mail");
    }
};

const forgotPassword = async (req, res) => {
    const { email, cpf } = req.body;
    
    if (!cpfValidador.isValid(cpf)) {
        return res.status(422).json({ error: "Cpf é obrigatório" });
    }
    if (!email) {
        return res.status(422).json({ error: "E-mail é obrigatório" });
    }

    // Verifica se o usuário existe
    const user = await prisma.usuarios.findUnique({
        where: { cpf },
    });

    if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado!" });
    }

    const recoveryCode = generateCode();

    try {
        await sendEmail(email, recoveryCode);

        // Armazena o código de recuperação no banco (opcionalmente com uma expiração)
        await prisma.recoveryCode.create({
            data: {
                email,
                code: recoveryCode,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000),  // Expira em 15 minutos
            },
        });

        return res.status(200).json({ message: "Código de recuperação enviado para o e-mail." });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao enviar o código. Tente novamente." });
    }
};

const validateRecoveryCode = async (req, res) => {
    const { email, cpf, code, newPassword } = req.body;

    // Verifica se o código é válido
    const recoveryData = await prisma.recoveryCode.findFirst({
        where: { email, code },
    });

    if (!recoveryData) {
        return res.status(400).json({ error: "Código inválido ou expirado." });
    }

    if (new Date(recoveryData.expiresAt) < new Date()) {
        return res.status(400).json({ error: "O código expirou." });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.usuarios.update({
        where: { cpf },
        data: { passwordHash: hashedPassword },
    });

    return res.status(200).json({ message: "Senha alterada com sucesso!" });
};

export { forgotPassword, validateRecoveryCode }