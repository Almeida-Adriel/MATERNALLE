import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const calcularPontuacaoEdimburgo = (q1, q2, q3, q4, q5, q6, q7, q8, q9) => {
  const respostas = [q1, q2, q3, q4, q5, q6, q7, q8, q9];

  let total = respostas.reduce((acc, r) => acc + Number(r || 0), 0);

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

  return { total, classificacao };
};

// SALVAR + CALCULAR
const salvarRespostasEdimburgo = async (req, res) => {
  try {
    const { id_usuario, q1, q2, q3, q4, q5, q6, q7, q8, q9 } = req.body ?? {};

    if (!id_usuario) {
      return res.status(400).json({ error: "id_usuario é obrigatório." });
    }

    const { total, classificacao } = calcularPontuacaoEdimburgo(q1, q2, q3, q4, q5, q6, q7, q8, q9);

    const resposta = await prisma.edimburgo.create({
      data: {
        id_usuario,
        q1: String(q1),
        q2: String(q2),
        q3: String(q3),
        q4: String(q4),
        q5: String(q5),
        q6: String(q6),
        q7: String(q7),
        q8: String(q8),
        q9: String(q9),
        resposta: classificacao
      }
    });

    return res.status(201).json({
      message: "Respostas salvas com sucesso.",
      total,
      classificacao,
      resposta
    });

  } catch (error) {
    console.error("Erro ao salvar respostas:", error);
    return res.status(500).json({ error: "Erro ao salvar respostas." });
  }
};

export { salvarRespostasEdimburgo };
