import prisma from "../utils/prisma.js";

const postConteudos = async (req, res) => {
  try {
    const {
      titulo,
      descricao,
      tipo_conteudo,
      link_referencia,
      outros,
      acesso,
    } = req.body;

    switch (true) {
      case !titulo || titulo.trim() === "":
        return res
          .status(400)
          .json({ error: 'O campo "titulo" é obrigatório.' });
      case !descricao || descricao.trim() === "":
        return res
          .status(400)
          .json({ error: 'O campo "descricao" é obrigatório.' });
      case !tipo_conteudo || tipo_conteudo.trim() === "":
        return res
          .status(400)
          .json({ error: 'O campo "tipo_conteudo" é obrigatório.' });
      case !acesso || acesso.trim() === "":
        return res
          .status(400)
          .json({ error: 'O campo "acesso" é obrigatório.' });
    }

    const novoConteudo = await prisma.conteudos.create({
      data: {
        titulo,
        descricao,
        tipo_conteudo,
        data_criacao: new Date(),
        link_referencia,
        acesso,
        outros,
      },
    });
    res.status(201).json(novoConteudo);
  } catch (error) {
    console.error("Erro ao criar conteúdo:", error);
    res.status(500).json({ error: "Erro ao criar conteúdo" });
  }
};

const getConteudos = async (req, res) => {
  const { search, order = "desc", page = 1, limit = 10 } = req.query;
  const user = req.user;
  const tipoPerfil = user.perfil;

  try {
    const conteudos = await prisma.conteudos.findMany({
      where: {
        acesso: tipoPerfil,
        OR: [
          {
            titulo: {
              contains: search || "", // Filtro por título
              mode: "insensitive", // Ignorar case-sensitive
            },
          },
          {
            descricao: {
              contains: search || "", // Filtro por descrição
              mode: "insensitive", // Ignorar case-sensitive
            },
          },
        ],
      },
      orderBy: {
        data_criacao: order === "desc" ? "desc" : "asc",
      },
      skip: (page - 1) * limit, // Paginando
      take: limit, // Limite de resultados por página
    });
    const totalConteudos = await prisma.conteudos.count({
      where: {
        acesso: tipoPerfil,
        OR: [
          {
            titulo: {
              contains: search || "",
              mode: "insensitive",
            },
          },
          {
            descricao: {
              contains: search || "",
              mode: "insensitive",
            },
          },
        ],
      },
    });

    const totalPages = Math.ceil(totalConteudos / limit);

    res.status(200).json({
      conteudos,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalConteudos,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar conteúdos:", error);
    res.status(500).json({ error: "Erro ao buscar conteúdos" });
  }
};

const getAllConteudos = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const conteudos = await prisma.conteudos.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        data_criacao: 'desc',
      },
    });

    const totalConteudos = await prisma.conteudos.count();

    const totalPages = Math.ceil(totalConteudos / limit);

    res.status(200).json({
      conteudos,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalConteudos,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar conteúdos:', error);
    res.status(500).json({ error: 'Erro ao buscar conteúdos' });
  }
};


export { postConteudos, getConteudos, getAllConteudos };
