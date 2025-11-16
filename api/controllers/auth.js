import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cpf as cpfValidador } from 'cpf-cnpj-validator';
import { statusMaternidadeEnum } from '../../app/src/utils/enum/statusMaternidade.js';

const register = async (req, res) => {
    const { 
        nome, 
        data_nascimento,
        cpf, 
        email,
        endereco,
        telefone, 
        password, 
        status_maternidade,
        dpp,
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
        case !status_maternidade:
            return res.status(422).json({ error: 'Status da maternidade é obrigatórios!' });
        case status_maternidade === Object.keys(statusMaternidadeEnum)[1] && !dpp:
            return res.status(422).json({ error: 'Data de previsão de parto é obrigatórios!' });
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
                status_maternidade,
                dpp: dpp ? new Date(dpp) : null,
                telefone,
                perfil: {
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
                            peso_nascimento: filho.peso_nascimento || null,
                            tipo_parto: filho.tipoParto || null,
                            genero: filho.genero || null,
                        })),
                    }
                }
            },
            include: {
                perfil: true,
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
    const user = await prisma.usuarios.findUnique({
        where: { cpf },
        include: { perfil: true }
    });

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
    const checkPassword = await bcrypt.compare(password, user.passwordHash);

    if (!checkPassword) {
        return res.status(422).json({ error: 'Senha inválida!' });
    }

    if (user.perfil && user.perfil.data_expiracao) {
        const hoje = new Date();
        const dataExpiracao = new Date(user.perfil.data_expiracao);
        
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
                perfil: user.perfil ? user.perfil.tipoPerfil : 'BASICO',
            },
            secretKey,
            { expiresIn: expirationTime }
        );

        const tokenMaxAge = 1000 * 60 * 60 * 24; 

        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('token', token, {
            httpOnly: true, // Impede acesso via JavaScript (XSS Protection)
            maxAge: tokenMaxAge, // Tempo de vida do cookie
            secure: isProduction, // only secure in production (HTTPS)
            sameSite: 'lax',
            domain: isProduction ? 'maternalle.onrender.com' : '192.168.1.19',
        });

        res.cookie('userId', user.id, {
            httpOnly: false,
            maxAge: tokenMaxAge,
            secure: isProduction,
            sameSite: 'lax',
            domain: isProduction ? 'maternalle.onrender.com' : '192.168.1.19',
        });

        await prisma.usuarios.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() }
        });

        return res.status(200).json({
            message: 'Autenticação realizada com sucesso!', 
            userPerfil: user.perfil.tipoPerfil,
            id: user.id,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
}

const logoutUser = async (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    
    try {
        // Clear cookies using the same security options used when setting them.
        res.cookie('token', '', {
            httpOnly: true,
            expires: new Date(0), // Data no passado
            secure: isProduction,
            sameSite: 'lax',
            domain: isProduction ? 'maternalle-d18x.onrender.com' : '192.168.1.19',
        });
        res.cookie('userId', '', { 
            httpOnly: false,
            expires: new Date(0),
            secure: isProduction,
            sameSite: 'lax',
            domain: isProduction ? 'maternalle-d18x.onrender.com' : '192.168.1.19',
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }

    return res.status(200).json({ message: 'Logout realizado com sucesso!' });    return tatus(200).json({ message: 'Logout realizado com sucesso!' });
}

export { register, loginUser, logoutUser };