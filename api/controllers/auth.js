import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cpf as cpfValidador } from 'cpf-cnpj-validator';

const register = async (req, res) => {
    const { 
        nome, 
        data_nascimento,
        cpf, 
        email,
        endereco,
        telefone, 
        password, 
        confirmPassword,
        perfil,
        filhos = [] 
    } = req.body;

    switch (true) {
        case !nome:
            return res.status(422).json({ error: 'Nome é obrigatório' });
        case !data_nascimento:
            return res.status(422).json({ error: 'Data de nascimento é obrigatória' });
        case !email:
            return res.status(422).json({ error: 'Email é obrigatório' });
        case !endereco:
            return res.status(422).json({ error: 'Endereço é obrigatório' });
        case !telefone:
            return res.status(422).json({ error: 'Telefone é obrigatório' });
        case !cpfValidador.isValid(cpf):
            return res.status(422).json({ error: 'Cpf do cliente é invalido' });
        case !password:
            return res.status(422).json({ error: 'Senha é obrigatória' });
        case password !== confirmPassword:
            return res.status(422).json({ error: 'As senhas não conferem!' });
        case !perfil:
            return res.status(422).json({ error: 'Dados de perfil são obrigatórios!' });
        case !perfil.tipoPerfil || !perfil.role:
            return res.status(422).json({ error: 'Os campos tipoPerfil, role e data_expiracao são obrigatórios no Perfil.' });
        default:
            break;
    }

    for (const filho of filhos) {
        if (!filho.nome) {
            return res.status(422).json({ error: "O nome do filho(a) é obrigatório" });
        }

        else if (!filho.data_nascimento) {
            return res.status(422).json({ error: "A data de nascimento do filho(a) é obrigatório" });
        }

        else if (!filho.cpf) {
            return res.status(422).json({ error: `O CPF do filho(a) ${filho.nome || ''} é obrigatório.` });
        }
        
        else if (!cpfValidador.isValid(filho.cpf)) { 
            return res.status(422).json({ error: `O CPF "${filho.cpf}" do filho(a) ${filho.nome || '' } é inválido.` });
        }
    }

    const userExists = await prisma.usuarios.findUnique({ where: { cpf } });

    if (userExists) {
        return res.status(422).json({ error: 'Por favor, utilize outro cpf!' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);

    let dataExpiracao;
    const hoje = new Date();

    switch (perfil.tipoPerfil) {
        case 'BASICO':
            dataExpiracao = null;
            break;
        case 'PREMIUM':
            dataExpiracao = new Date(hoje.setMonth(hoje.getMonth() + 1));
            break;
        case 'PREMIUM_ANUAL':
            dataExpiracao = new Date(hoje.setFullYear(hoje.getFullYear() + 1));
            break;
        default:
            return res.status(422).json({ error: 'Perfil inválido!' });
    }

    try {
        const user = await prisma.usuarios.create({
            data: {
                nome,
                cpf,
                data_nascimento: new Date(data_nascimento),
                email,
                passwordHash: hashed,
                lastLoginAt: new Date(),
                endereco,
                telefone,
                Perfil: {
                    create: {
                        tipoPerfil: perfil.tipoPerfil,
                        role: perfil.role,
                        data_expiracao: dataExpiracao,
                    }
                },
                filhos: {
                    createMany: {
                        data: filhos.map(filho => ({
                            nome: filho.nome,
                            cpf: filho.cpf,
                            data_nascimento: new Date(filho.data_nascimento),
                        })),
                    }
                }
            },
            include: {
                Perfil: true,
                filhos: true,
            }
        });
        return res.status(201).json({ message: 'Usuário criado com sucesso!', usario: user });
    } catch (error) {
        console.log(error);
        if (error.code === 'P2002' && error.meta?.target.includes('cpf')) {
            return res.status(409).json({ error: 'Um CPF já está cadastrado (usuário ou filho).' });
        }
        return res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
}

const loginUser = async (req, res) => {
    const { cpf, password } = req.body;

    if (!cpfValidador.isValid(cpf)) {
        return res.status(422).json({ error: 'O cpf é obrigatório!' });
    }
    if (!password) {
        return res.status(422).json({ error: 'A senha é obrigatória!' });
    }
    const user = await prisma.usuarios.findUnique({ where: { cpf } });

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
    const checkPassword = await bcrypt.compare(password, user.passwordHash);

    if (!checkPassword) {
        return res.status(422).json({ error: 'Senha inválida!' });
    }

    if (user.Perfil && user.Perfil.data_expiracao) {
        const hoje = new Date();
        const dataExpiracao = new Date(user.Perfil.data_expiracao);
        
        if (dataExpiracao < hoje) {
            return res.status(401).json({ error: 'O seu perfil expirou. Renove sua assinatura!' });
        }
    }

    try {
        const secretKey = process.env.SECRET_KEY;
        const expirationTime = '1d';

        const token = jwt.sign(
            {
                id: user.id,
                cpf: user.cpf,
            },
            secretKey,
            { expiresIn: expirationTime }
        );

        const maxAge = 1000 * 60 * 60 * 24; // 1 dia em milissegundos

        res.cookie('token', token, {
            httpOnly: true, // Impede acesso via JavaScript (XSS Protection)
            maxAge: maxAge, // Tempo de vida do cookie
            secure: process.env.NODE_ENV === 'production', // Use 'true' em produção (HTTPS)
            sameSite: 'Lax', // Ajuda contra CSRF em requisições GET
        });

        res.cookie('userId', user.id, {
            httpOnly: false, // Pode ser acessado via JavaScript
            maxAge: maxAge, // Tempo de vida do cookie
            secure: process.env.NODE_ENV === 'production', // Use 'true' em produção (HTTPS)
            sameSite: 'Lax', // Ajuda contra CSRF em requisições GET
        });

        await prisma.usuarios.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        return res.status(200).json({
            message: 'Autenticação realizada com sucesso!', 
            userCpf: user.cpf,
            id: user.id 
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
}

const logoutUser = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Data no passado
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });
    res.cookie('userId', '', { 
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    return res.status(200).json({ message: 'Logout realizado com sucesso!' });
}

export { register, loginUser, logoutUser };