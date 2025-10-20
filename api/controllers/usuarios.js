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

const postFilhos = async (req, res) => {
  try {
    const { id_usuario, nome, data_nascimento } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: 'id_usuario é obrigatório.' });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id: id_usuario },
      select: { id: true }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    let itens = [];
    if (Array.isArray(filhos)) {
      itens = filhos;
    } else {
      if (!nome || !data_nascimento) {
        return res.status(400).json({
          error: 'Para cadastro unitário, nome e data_nascimento são obrigatórios.'
        });
      }
      itens = [{ nome, data_nascimento }];
    }

    const toCreate = itens.map((f, idx) => {
      if (!f?.nome || !f?.data_nascimento) {
        throw new Error(`No item ${idx + 1}: nome e data_nascimento são obrigatórios.`);
      }
      const parsedDate = new Date(f.data_nascimento);
      if (isNaN(parsedDate.getTime())) {
        throw new Error(`No item ${idx + 1}: data_nascimento inválida (use ISO: YYYY-MM-DD).`);
      }
      return {
        id_usuario,
        nome: String(f.nome).trim(),
        data_nascimento: parsedDate
      };
    });

    // cria registros (createMany para lote; create para unitário com retorno completo)
    if (toCreate.length > 1) {
      const result = await prisma.recem_nascidos.createMany({
        data: toCreate,
        skipDuplicates: false
      });

      // busca os inseridos para retornar (por simplicidade, traz todos do usuário)
      const inseridos = await prisma.recem_nascidos.findMany({
        where: { id_usuario },
        orderBy: { data_nascimento: 'asc' }
      });

      return res.status(201).json({
        message: 'Filhos cadastrados com sucesso.',
        count: result.count,
        filhos: inseridos
      });
    } else {
      const created = await prisma.recem_nascidos.create({
        data: toCreate[0]
      });
      return res.status(201).json({
        message: 'Filho(a) cadastrado(a) com sucesso.',
        filho: created
      });
    }
  } catch (error) {
    console.error(error);
    const msg = typeof error?.message === 'string' ? error.message : 'Erro ao cadastrar filho(s).';
    return res.status(500).json({ error: msg });
  }
};

export { getAllUsuarios, getUsuario, postFilhos };