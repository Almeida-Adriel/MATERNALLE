import transporter from '../utils/mailer.js';
import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import { cpf as cpfValidador } from 'cpf-cnpj-validator';

const generateCode = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
};

const emailTemplate = (code) => {
    const primaryColor = '#ec407a'; // --color-brand-500
    const lightColor = '#fba4b6'; // --color-brand-300
    const lightBg = '#fff1f4'; // --color-brand-50

    return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Recuperação de Senha</title>
            <style>
                /* Reset básico */
                body { margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4; }
                table { border-collapse: collapse; width: 100%; }
                td { padding: 0; }
            </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4;">

            <table role="presentation" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                
                <tr>
                    <td align="center" style="background-color: ${lightBg}; padding: 15px 0; border-radius: 8px 8px 0 0;">
                        <h1 style="color: ${primaryColor}; font-size: 20px; margin: 0;">Recuperação de Senha</h1>
                    </td>
                </tr>
                
                <tr>
                    <td style="padding: 40px 30px;">
                        
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 20px 0;">Olá,</p>
                        
                        <p style="color: #333333; font-size: 16px; line-height: 24px; margin: 0 0 30px 0;">Você solicitou a recuperação da sua senha. Utilize o código de 5 dígitos abaixo para prosseguir com a redefinição:</p>
                        
                        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center" style="padding: 20px; background-color: ${primaryColor}; border-radius: 4px;">
                                    <span style="color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 5px; display: block;">${code}</span>
                                </td>
                            </tr>
                        </table>

                        <p style="color: #333333; font-size: 14px; line-height: 20px; margin: 30px 0 15px 0; text-align: center;">Este código expira em 15 minutos.</p>

                        <p style="color: #333333; font-size: 14px; line-height: 20px; margin: 0;">Se você não solicitou esta alteração, por favor, ignore este e-mail.</p>
                    </td>
                </tr>
                
                <tr>
                    <td align="center" style="background-color: #f8f8f8; padding: 20px 30px; border-radius: 0 0 8px 8px; border-top: 1px solid ${lightColor};">
                        <p style="color: #999999; font-size: 12px; margin: 0;">Maternalle</p>
                    </td>
                </tr>

            </table>

        </body>
        </html>
    `;
};

const sendEmail = async (email, code) => {
    const htmlContent = emailTemplate(code);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Código de Recuperação de Senha Maternalle',
        text: `Seu código de recuperação é: ${code}. Este código expira em 15 minutos.`,
        html: htmlContent,
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

        await prisma.recoveryCode.deleteMany({
            where: { cpf },
        });

        await prisma.recoveryCode.create({
            data: {
                cpf,
                code: recoveryCode,
                expiresAt: new Date(Date.now() + 15 * 60 * 1000), // Expira em 15 minutos
            },
        });

        return res.status(200).json({ message: "Código de recuperação enviado para o e-mail." });
    } catch (error) {
        return res.status(500).json({ error: "Erro ao enviar o código. Tente novamente." });
    }
};

const validateRecoveryCode = async (req, res) => {
    const { cpf, code, newPassword } = req.body;

    // Verifica se o código é válido
    const recoveryData = await prisma.recoveryCode.findFirst({
        where: { 
            cpf,
            code,
            expiresAt: {
                gt: new Date(),
            } 
        },
        orderBy: {
            expiresAt: 'desc', 
        }
    });

    if (!recoveryData) {
        return res.status(400).json({ error: "Código inválido ou expirado." });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await prisma.usuarios.update({
        where: { cpf },
        data: { passwordHash: hashedPassword },
    });

    await prisma.recoveryCode.deleteMany({
        where: { cpf },
    });

    return res.status(200).json({ message: "Senha alterada com sucesso!" });
};

export { forgotPassword, validateRecoveryCode }