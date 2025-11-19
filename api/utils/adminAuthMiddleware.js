const adminAuthMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Acesso Proibido. Requer Permissão de Administrador.' });
    }

    next();
};

export default adminAuthMiddleware;