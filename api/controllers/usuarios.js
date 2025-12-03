import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import { cpf as cpfValidador } from 'cpf-cnpj-validator';
import { statusMaternidadeEnum } from '../../app/src/utils/enum/statusMaternidade.js';

const postUsuario = async (req, res) => {
  const { 
    nome, 
    data_nascimento,
    cpf, 
    email,
    endereco,
    telefone, 
    password, 
    status_maternidade,
    dpp,
    confirmPassword,
    role,
    perfil,
  } = req.body;

  switch (true) {
    case !nome:
        return res.status(422).json({ error: 'Nome é obrigatório' });
    case !data_nascimento:
        return res.status(422).json({ error: 'Data de nascimento é obrigatória' });
    case !email:
        return res.status(422).json({ error: 'Email é obrigatório' });
    case !endereco:
        return res.status(422).json({ error: 'Endereço é obrigatório' });
    case !telefone:
        return res.status(422).json({ error: 'Telefone é obrigatório' });
    case !cpfValidador.isValid(cpf):
        return res.status(422).json({ error: 'Cpf do cliente é invalido' });
    case !password:
        return res.status(422).json({ error: 'Senha é obrigatória' });
    case password !== confirmPassword:
        return res.status(422).json({ error: 'As senhas não conferem!' });
    case !status_maternidade:
        return res.status(422).json({ error: 'Status da maternidade é obrigatórios!' });
    case status_maternidade === Object.keys(statusMaternidadeEnum)[1] && !dpp:
        return res.status(422).json({ error: 'Data de previsão de parto é obrigatórios!' });
    case (role !== 'ADMIN' && !perfil):
        return res.status(422).json({ error: 'Dados de perfil são obrigatórios!' });
    case (role !== 'ADMIN' && !perfil.tipoPerfil):
        return res.status(422).json({ error: 'O campo tipoPerfil é obrigatórios no Perfil.' });
    default:
        break;
  }

  const userExists = await prisma.usuarios.findUnique({ where: { cpf } });

  if (userExists) {
      return res.status(422).json({ error: 'Por favor, utilize outro cpf!' });
  }

  const salt = await bcrypt.genSalt(12);
  const hashed = await bcrypt.hash(password, salt);

  let dataExpiracao;
  const hoje = new Date();
  if (role !== 'ADMIN') {
    switch (perfil.tipoPerfil) {
      case 'BASICO':
        dataExpiracao = null;
        break;
      case 'PREMIUM':
        dataExpiracao = new Date(hoje.setMonth(hoje.getMonth() + 1));
        break;
      case 'PREMIUM_ANUAL':
        dataExpiracao = new Date(hoje.setFullYear(hoje.getFullYear() + 1));
        break;
      default:
        return res.status(422).json({ error: 'Perfil inválido!' });
    }
  };

  try {
    const user = await prisma.usuarios.create({
      data: {
        nome,
        cpf,
        data_nascimento: new Date(data_nascimento),
        email,
        passwordHash: hashed,
        lastLoginAt: new Date(),
        endereco,
        status_maternidade,
        dpp: dpp ? new Date(dpp) : null,
        telefone,
        role,
        perfil: {
          create: {
            tipoPerfil: perfil.tipoPerfil,
            data_expiracao: dataExpiracao,
          }
        },
      },
      include: {
        perfil: true,
      }
    });
    return res.status(201).json({ message: 'Usuário criado com sucesso!', usario: user });
  } catch (error) {
    console.log(error);
    if (error.code === 'P2002' && error.meta?.target.includes('cpf')) {
      return res.status(409).json({ error: 'Um CPF já está cadastrado (usuário ou filho).' });
    }
    return res.status(500).json({ error: 'Aconteceu um erro no servidor, tente novamente mais tarde!' });
  }
}

const getAllUsuarios = async (req, res) => {
  const { search, page = 1, limit = 8 } = req.query;
  const searchFilter = {
    OR: [
      {
        nome: {
          contains: search || "",
          mode: "insensitive",
        },
      },
    ],
  }
  try {
    const usuarios = await prisma.usuarios.findMany({
      include: { perfil: true },
      skip: (page - 1) * limit,
      take: limit,
      where: searchFilter,
    });

    const totalUsuarios = await prisma.usuarios.count({
      where: searchFilter
    });

    const totalPages = Math.ceil(totalUsuarios / limit);

    res.status(200).json({
      usuarios,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalItems: totalUsuarios,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsuario = async (req, res) => {
  try {
    const idDoUsuario = req.query.id; 

    if (!idDoUsuario) {
        return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    const usuario = await prisma.usuarios.findUnique({
      where: { id: idDoUsuario },
      select: {
        id: true,
        nome: true,
        cpf: true,
        email: true,
        data_nascimento: true,
        lastLoginAt: true,
        telefone: true,
        endereco: true,
        status_maternidade: true,
        dpp: true,
        role: true,
        perfil: true,
        filhos: true,
        notas: true,
        edimburgo: true
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

const deleteUsuario = async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.$transaction(async (tx) => {
      await tx.filhos.deleteMany({
        where: { id_usuario: id },
      });

      await tx.perfil.deleteMany({
        where: { id_usuario: id },
      });

      await tx.usuarios.delete({
        where: { id },
      });
    });
    res.status(200).json({ message: 'Conteúdo deletado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao deletar o conteúdo.' });
  }
};

const updateUsuario = async (req, res) => {
    const id = req.params.id;

    const usuarioAtual = await prisma.usuarios.findUnique({ where: { id } });

    if (!usuarioAtual) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    const { 
      cpf,
      data_nascimento,
      dpp,
      email,
      endereco,
      telefone,
      nome,
      status_maternidade,
      password,
      confirmPassword,
      perfil,
    } = req.body;

    switch (true) {
      case !nome:
        return res.status(400).json({ error: 'Nome é obrigatório' });
      case !data_nascimento:
        return res.status(400).json({ error: 'Data de nascimento é obrigatória' });
      case !email:
        return res.status(400).json({ error: 'Email é obrigatório' });
      case !endereco:
        return res.status(400).json({ error: 'Endereço é obrigatório' });
      case !telefone:
        return res.status(400).json({ error: 'Telefone é obrigatório' });
      case !cpfValidador.isValid(cpf):
        return res.status(400).json({ error: 'Cpf do cliente é invalido' });
      case (password || confirmPassword) && (password !== confirmPassword):
        return res.status(400).json({ error: 'As senhas não conferem!' });
      case !status_maternidade:
        return res.status(400).json({ error: 'Status da maternidade é obrigatórios!' });
      case status_maternidade === Object.keys(statusMaternidadeEnum)[1] && !dpp:
        return res.status(400).json({ error: 'Data de previsão de parto é obrigatórios!' });
      case !perfil:
        return res.status(400).json({ error: 'Dados de perfil são obrigatórios!' });
      case !perfil.tipoPerfil:
        return res.status(400).json({ error: 'O campo tipoPerfil é obrigatórios no Perfil.' });
      default:
        break;
    }

    const userWithSameCpf = await prisma.usuarios.findUnique({ where: { cpf } });

    if (userWithSameCpf && userWithSameCpf.id !== id) {
      return res.status(422).json({ error: 'Por favor, utilize outro cpf, este já está em uso!' });
    }

    let hashed = usuarioAtual.passwordHash; // Mantém a hash atual por padrão
    
    if (password) {
      // Se a nova senha for fornecida, faz o hash dela
      const salt = await bcrypt.genSalt(12);
      hashed = await bcrypt.hash(password, salt);
    }

    let dataExpiracao;
    const hoje = new Date();

    switch (perfil.tipoPerfil) {
      case 'BASICO':
        dataExpiracao = null;
        break;
      case 'PREMIUM':
        dataExpiracao = new Date(hoje.setMonth(hoje.getMonth() + 1));
        break;
      case 'PREMIUM_ANUAL':
        dataExpiracao = new Date(hoje.setFullYear(hoje.getFullYear() + 1));
        break;
      default:
        return res.status(422).json({ error: 'Perfil inválido!' });
    }

    try {
        const usuarioAtualizado = await prisma.usuarios.update({
          where: { id: id },
          data: {
            nome,
            cpf,
            data_nascimento: new Date(data_nascimento),
            email,
            passwordHash: hashed,
            endereco,
            status_maternidade,
            dpp: dpp ? new Date(dpp) : null,
            telefone,
            role,
            perfil: {
              update: {
                tipoPerfil: perfil.tipoPerfil,
                data_expiracao: dataExpiracao,
              }
            },
          },
        });
        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar a Conteúdo.' });
    }
};

export { getAllUsuarios, getUsuario, updateUsuario, deleteUsuario, postUsuario };