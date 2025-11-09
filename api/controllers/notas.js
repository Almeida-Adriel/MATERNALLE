import prisma from '../utils/prisma.js';

const postNotas = async (req, res) => {
    const { titulo, descricao, id_usuario, data_lembrete, lembrete } = req.body;

    switch (true) {
        case !titulo:
            return res.status(422).json({ error: 'O título da nota é obrigatório.' });
        case !descricao:
            return res.status(422).json({ error: 'A descrição da nota é obrigatória.' });
        case !id_usuario:
            return res.status(422).json({ error: 'O ID do usuário é obrigatório.' });
        case lembrete && !data_lembrete:
            return res.status(422).json({ error: 'A data do lembrete é obrigatória quando o lembrete está ativado.' });
        default:
            break;
    }
    
    const data_criacao = new Date();

    try {
        const novaNota = await prisma.notas.create({
            data: {
                titulo,
                descricao,
                id_usuario,
                data_lembrete,
                data_criacao,
                lembrete,
            },
        });
        res.status(201).json(novaNota);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar a nota.' });
    }
};

const getNotas = async (req, res) => {
    const { id_usuario } = req.query;
    try {
        const notas = await prisma.notas.findMany({
            where: { id_usuario: id_usuario },
            orderBy: { data_criacao: 'desc' },
        });
        res.status(200).json(notas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar as notas.' });
    }
};

const getNota = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: 'ID da nota não fornecido.' });
    }

    try {
        const nota = await prisma.notas.findUnique({
            where: { id: id},
        });
        if (!nota) {
            return res.status(404).json({ error: 'Nota não encontrada.' });
        }
        res.status(200).json(nota);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar a nota.' });
    }
};

const getNotaLembrete = async (req, res) => {
    const { id_usuario } = req.query; 

    if (!id_usuario) {
        return res.status(400).json({ error: 'O ID do usuário é obrigatório para buscar lembretes.' });
    }

    try {
        const notasComLembrete = await prisma.notas.findMany({
            where: { 
                id_usuario: id_usuario,
                lembrete: true,
            },
            orderBy: { data_lembrete: 'desc' },
        });
        res.status(200).json(notasComLembrete);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar as lembrete.' });
    }
};

const updateNota = async (req, res) => {
    const id = req.params.id;
    const { titulo, descricao, data_lembrete, lembrete } = req.body;

    const dataAtualizacao = new Date();

     switch (true) {
        case !titulo:
            return res.status(422).json({ error: 'O título da nota é obrigatório.' });
        case !descricao:
            return res.status(422).json({ error: 'A descrição da nota é obrigatória.' });
        case lembrete && !data_lembrete:
            return res.status(422).json({ error: 'A data do lembrete é obrigatória quando o lembrete está ativado.' });
        default:
            break;
    }

    try {
        const notaAtualizada = await prisma.notas.update({
            where: { id: id },
            data: {
                titulo,
                descricao,
                data_lembrete,
                lembrete,
                data_criacao: dataAtualizacao,
            },
        });
        res.status(200).json(notaAtualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar a nota.' });
    }
};

const deleteNota = async (req, res) => {
    const id = req.params.id;
    try {
        await prisma.notas.delete({
            where: { id: id },
        });
        res.status(200).json({ message: 'Nota deletada com sucesso.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao deletar a nota.' });
    }
};

export { postNotas, getNotas, getNota, getNotaLembrete, updateNota, deleteNota };
