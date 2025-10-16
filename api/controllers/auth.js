import prisma from '../utils/prisma.js';

const register = async (req, res) => {
    const { nome, data_nascimento, email, passwordHash, confirmPassword } = req.body;

    switch (true) {
        case !nome:
            return res.status(422).json({ error: 'Nome é obrigatório' });
        case !data_nascimento:
            return res.status(422).json({ error: 'Data de nascimento é obrigatória' });
        case !email:
            return res.status(422).json({ error: 'Email é obrigatório' });
        case !passwordHash:
            return res.status(422).json({ error: 'Senha é obrigatória' });
        case passwordHash !== confirmPassword:
            return res.status(422).json({ error: 'As senhas não conferem!' });
        default:
            break;
    }

    const userExists = await prisma.usuarios.findUnique({ email: email });

    if (userExists) {
        return res.status(422).json({ error: 'Por favor, utilize outro e-mail!' });
    }

    const salt = await bcrypt.genSalt(12);
    const password = await bcrypt.hash(passwordHash, salt);

    const user = new userModel({
        nome,
        data_nascimento,
        email,
        passwordHash: password
    });

    try {
        await user.save();
        res.status(201).json({ message: 'Usuário criado com sucesso!' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
}

const loginUser = async (req, res) => {
    const { email, passwordHash } = req.body;

    if (!email) {
        return res.status(422).json({ error: 'O email é obrigatório!' });
    }
    if (!passwordHash) {
        return res.status(422).json({ error: 'A senha é obrigatória!' });
    }
    const user = await prisma.usuarios.findUnique({ email: email });

    if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado!' });
    }
    const checkPassword = await bcrypt.compare(passwordHash, user.passwordHash);

    if (!checkPassword) {
        return res.status(422).json({ error: 'Senha inválida!' });
    }
    
    try {
        const secretKey = process.env.SECRET_KEY;
        const token = jwt.sign(
            {
                id: user.id,
                lastLogin: new Date(),
            },
            secretKey,
        );
        res.status(200).json({ message: 'Autenticação realizada com sucesso!', token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
    }
}

export { register, loginUser };