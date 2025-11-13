import prisma from '../utils/prisma.js';

const postConteudos = async (req, res) => {
  try {
    const { titulo, descricao, tipo_conteudo, link_referencia, outros, acesso } = req.body;
    
    switch (true) {
        case !titulo || titulo.trim() === '':
            return res.status(400).json({ error: 'O campo "titulo" é obrigatório.' });
        case !descricao || descricao.trim() === '':
            return res.status(400).json({ error: 'O campo "descricao" é obrigatório.' });
        case !tipo_conteudo || tipo_conteudo.trim() === '':
            return res.status(400).json({ error: 'O campo "tipo_conteudo" é obrigatório.' });    
        case !acesso || acesso.trim() === '':
            return res.status(400).json({ error: 'O campo "acesso" é obrigatório.' });
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
  }
    catch (error) {
    console.error('Erro ao criar conteúdo:', error);
    res.status(500).json({ error: 'Erro ao criar conteúdo' });
  }
};

const getConteudos = async (req, res) => {
    const { tipoPerfil } = req.query;

    try {
        const conteudos = await prisma.conteudos.findMany({
            where: acesso === tipoPerfil,
            orderBy: {
                data_criacao: 'desc',
            },
        });
        res.status(200).json(conteudos);
    } catch (error) {
        console.error('Erro ao buscar conteúdos:', error);
        res.status(500).json({ error: 'Erro ao buscar conteúdos' });
    }
};

export { postConteudos, getConteudos };