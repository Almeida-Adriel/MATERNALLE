import prisma from '../utils/prisma.js';

// Listar todos os usuários
const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuarios.findMany({
      include: { recem_nascidos: true, notas: true }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsuario = async (req, res) => {
  try {
    const idDoUsuario = req.query.id; 

    if (!idDoUsuario) {
        return res.status(400).json({ error: 'ID do usuário não fornecido na query.' });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id: idDoUsuario },
      select: {
        id: true,
        nome: true,
        email: true,
        data_nascimento: true,
        lastLoginAt: true,
        telefone: true,
        endereco: true,
        role: true,
        recem_nascidos: true,
        notas: true
      }
    });

    if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: error.message || 'Erro interno do servidor.' });
  }
};

export { getAllUsuarios, getUsuario };