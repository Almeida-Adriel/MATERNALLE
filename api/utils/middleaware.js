import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    try {
        // Obtém o header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
        }

        // Formato esperado: "Bearer token_aqui"
        const [, token] = authHeader.split(' ');

        if (!token) {
            return res.status(401).json({ error: 'Token inválido ou ausente.' });
        }

        const secretKey = process.env.SECRET_KEY;

        // Verifica e decodifica o token
        const decoded = jwt.verify(token, secretKey);

        // Anexa dados do usuário à requisição
        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token expirado ou inválido.' });
    }
};

export default authMiddleware;
