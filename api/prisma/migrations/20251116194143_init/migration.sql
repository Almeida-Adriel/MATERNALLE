-- CreateEnum
CREATE TYPE "TipoConteudo" AS ENUM ('PUERPERA', 'GESTACAO', 'DIETA', 'EXERCICIO', 'VACINA', 'EXAME', 'SINTOMAS', 'OUTROS');

-- CreateTable
CREATE TABLE "Conteudos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_criacao" DATE NOT NULL,
    "tipo_conteudo" "TipoConteudo" NOT NULL,
    "acesso" "tipoPerfil" NOT NULL,
    "outros" TEXT,
    "link_referencia" TEXT,

    CONSTRAINT "Conteudos_pkey" PRIMARY KEY ("id")
);
