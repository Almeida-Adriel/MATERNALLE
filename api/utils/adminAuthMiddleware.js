const adminAuthMiddleware = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Acesso negado. Usuário não autenticado.' });
        }

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Acesso proibido. Permissão de administrador necessária.' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao verificar permissões.' });
    }
};

export default adminAuthMiddleware;