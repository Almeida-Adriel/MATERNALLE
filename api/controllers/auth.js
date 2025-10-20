import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const register = async (req, res) => {
    const { nome, data_nascimento, email, password, confirmPassword } = req.body;

    switch (true) {
        case !nome:
            return res.status(422).json({ error: 'Nome é obrigatório' });
        case !data_nascimento:
            return res.status(422).json({ error: 'Data de nascimento é obrigatória' });
        case !email:
            return res.status(422).json({ error: 'Email é obrigatório' });
        case !password:
            return res.status(422).json({ error: 'Senha é obrigatória' });
        case password !== confirmPassword:
            return res.status(422).json({ error: 'As senhas não conferem!' });
        default:
            break;
    }

    const userExists = await prisma.usuarios.findUnique({ where: { email } });

    if (userExists) {
        return res.status(422).json({ error: 'Por favor, utilize outro e-mail!' });
    }

    const salt = await bcrypt.genSalt(12);
    const hashed = await bcrypt.hash(password, salt);

    try {
        const user = await prisma.usuarios.create({
            data: {
                nome,
                data_nascimento: new Date(data_nascimento),
                email,
                passwordHash: hashed,
                lastLoginAt: new Date()
            }
        });
        return res.status(201).json({ message: 'Usuário criado com sucesso!', id: user.id });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(422).json({ error: 'O email é obrigatório!' });
    }
    if (!password) {
        return res.status(422).json({ error: 'A senha é obrigatória!' });
    }
    const user = await prisma.usuarios.findUnique({ where: { email } });

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
    const checkPassword = await bcrypt.compare(password, user.passwordHash);

    if (!checkPassword) {
        return res.status(422).json({ error: 'Senha inválida!' });
    }

    try {
        const secretKey = process.env.SECRET_KEY;
        const expirationTime = '1d';

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
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
            userEmail: user.email,
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