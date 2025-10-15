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

// Criar um usuário
const createUsuario = async (req, res) => {
  const { cpf, nome, data_nascimento, email, senha } = req.body;
  try {
    const usuario = await prisma.usuarios.create({
      data: { cpf, nome, data_nascimento, email, senha }
    });
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllUsuarios, createUsuario };