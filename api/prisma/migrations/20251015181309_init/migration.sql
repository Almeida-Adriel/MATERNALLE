-- CreateTable
CREATE TABLE "Usuarios" (
    "id" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recem_nascidos" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Recem_nascidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notas" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recem_nascidos" ADD CONSTRAINT "Recem_nascidos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notas" ADD CONSTRAINT "Notas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
