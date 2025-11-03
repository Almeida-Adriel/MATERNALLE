import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    // 1. Tenta obter o token do cookie
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    try {
        const secretKey = process.env.SECRET_KEY;
        // 2. Verifica o token
        const decoded = jwt.verify(token, secretKey);
        
        // 3. Anexa os dados do usuário à requisição
        req.user = decoded; 
        
        // 4. Continua para a próxima função (o controller)
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido.' });
    }
};

export default authMiddleware;