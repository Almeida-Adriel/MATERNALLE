import prisma from "../utils/prisma.js";
import supabase from "../utils/supabase.js";
import { v4 as uuid } from "uuid";

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

    let imagemUrl = null;

    if (req.file) {
      const file = req.file;
      const fileExt = file.originalname.split(".").pop();
      const fileName = `${uuid()}.${fileExt}`;
      const filePath = `conteudos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("conteudos-img")
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error(uploadError);
        return res.status(500).json({ error: "Erro ao fazer upload da imagem." });
      }

      // URL pública da imagem
      imagemUrl = supabase.storage
        .from("conteudos-img")
        .getPublicUrl(filePath).data.publicUrl;
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
        imagemUrl,
      },
    });
    res.status(201).json(novoConteudo);
  } catch (error) {
    console.error("Erro ao criar conteúdo:", error);
    res.status(500).json({ error: "Erro ao criar conteúdo" });
  }
};

const getConteudo = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID do conteúdo não fornecido." });
  }

  try {
    const conteudo = await prisma.conteudos.findUnique({
      where: { id },
    });

    if (!conteudo) {
      return res.status(404).json({ error: "Conteúdo não encontrado." });
    }

    res.status(200).json(conteudo);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message || "Erro interno do servidor.",
    });
  }
};

const getConteudos = async (req, res) => {
  const { search, order = "desc", page = 1, limit = 10 } = req.query;
  const user = req.user;
  const tipoPerfil = user.perfil;

  const niveisAcesso = {
    BASICO: ["BASICO"],
    PREMIUM: ["BASICO", "PREMIUM"],
    PREMIUM_ANUAL: ["BASICO", "PREMIUM", "PREMIUM_ANUAL"]
  };

  const allowedAccess = niveisAcesso[tipoPerfil] || ["BASICO"];

  try {
    const conteudos = await prisma.conteudos.findMany({
      where: {
        acesso: { in: allowedAccess },
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
        acesso: { in: allowedAccess },
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
  const { search, order = "desc", page = 1, limit = 8 } = req.query;

  try {
    const conteudos = await prisma.conteudos.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
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
      orderBy: {
        data_criacao: order === "desc" ? "desc" : "asc",
      },
    });

    const totalConteudos = await prisma.conteudos.count({
      where: {
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
    console.error('Erro ao buscar conteúdos:', error);
    res.status(500).json({ error: 'Erro ao buscar conteúdos' });
  }
};

const deleteConteudo = async (req, res) => {
  const id = req.params.id;
  try {
      await prisma.conteudos.delete({
          where: { id: id },
      });
      res.status(200).json({ message: 'Conteúdo deletado com sucesso.' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar o conteúdo.' });
  }
};

const updateConteudo = async (req, res) => {
    const id = req.params.id;

    const { titulo,
      descricao,
      tipo_conteudo,
      link_referencia,
      outros,
      acesso 
    } = req.body;

    const dataAtualizacao = new Date();

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

    try {
      let imagemUrl;

      if (req.file) {
        const file = req.file;
        const fileExt = file.originalname.split(".").pop();
        const fileName = `${uuid()}.${fileExt}`;
        const filePath = `conteudos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("conteudos-img")
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.error(uploadError);
          return res.status(500).json({ error: "Erro ao fazer upload da imagem." });
        }

        imagemUrl = supabase.storage
          .from("conteudos-img")
          .getPublicUrl(filePath).data.publicUrl;
      }
      const conteudoAtualizado = await prisma.conteudos.update({
          where: { id: id },
          data: {
            descricao,
            tipo_conteudo,
            link_referencia,
            outros,
            acesso,
            data_criacao: dataAtualizacao,
            link_referencia,
            ...(imagemUrl && { imagemUrl }),
          },
      });
      res.status(200).json(conteudoAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar a Conteúdo.' });
    }
};

export { postConteudos, getConteudo, getConteudos, getAllConteudos, deleteConteudo, updateConteudo };
