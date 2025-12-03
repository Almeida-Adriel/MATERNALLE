import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const salvarRespostasEdimburgo = async (req, res) => {
  try {
    const { id_usuario, q1, q2, q3, q4, q5, q6, q7, q8, q9 } = req.body;

    if (!id_usuario) {
      return res.status(400).json({ error: "id_usuario é obrigatório." });
    }

    const resposta = await prisma.edimburgoResposta.create({
      data: {
        id_usuario,
        q1,
        q2,
        q3,
        q4,
        q5,
        q6,
        q7,
        q8,
        q9
      }
    });

    return res.status(201).json({
      message: "Respostas salvas com sucesso.",
      resposta
    });

  } catch (error) {
    console.error("Erro ao salvar respostas:", error);
    return res.status(500).json({ error: "Erro ao salvar respostas." });
  }
};

const calcularPontuacaoEdimburgo = async (req, res) => {
  try {
    const { q1, q2, q3, q4, q5, q6, q7, q8, q9 } = req.body;

    const respostas = [q1, q2, q3, q4, q5, q6, q7, q8, q9];

    // função que converte opção → pontuação
    const mapPontuacao = (opcao) => {
      const index = opcao.index; 
      return index;
    };

    let total = 0;

    respostas.forEach((r) => {
      if (!r || r.index === undefined) return;
      total += r.index;
    });

    let classificacao = "";

    if (total <= 7) {
      classificacao =
        "Dentro do esperado: Você está passando por um momento desafiador, mas seus sentimentos estão dentro do que é comum no puerpério.";
    } else if (total >= 8 && total <= 14) {
      classificacao =
        "Atenção necessária: Algumas emoções e sintomas podem indicar que seu corpo e mente estão pedindo uma pausa.";
    } else {
      classificacao =
        "Procure ajuda profissional: Seus sintomas são importantes e merecem cuidado. Agende uma consulta com um psicólogo ou obstetra.";
    }

    return res.json({
      total,
      classificacao,
    });
  } catch (error) {
    console.error("Erro ao calcular pontuação:", error);
    return res.status(500).json({ error: "Erro ao calcular pontuação." });
  }
};

export {calcularPontuacaoEdimburgo, salvarRespostasEdimburgo}