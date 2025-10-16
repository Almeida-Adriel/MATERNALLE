/*
  Warnings:

  - You are about to drop the column `cpf` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `senha` on the `Usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `lastLoginAt` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `Usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Notas" ALTER COLUMN "data" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Recem_nascidos" ALTER COLUMN "data_nascimento" SET DATA TYPE DATE;

-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "cpf",
DROP COLUMN "senha",
ADD COLUMN     "lastLoginAt" DATE NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ALTER COLUMN "data_nascimento" SET DATA TYPE DATE;

-- CreateIndex
CREATE INDEX "Notas_id_usuario_idx" ON "Notas"("id_usuario");

-- CreateIndex
CREATE INDEX "Recem_nascidos_id_usuario_idx" ON "Recem_nascidos"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_email_key" ON "Usuarios"("email");
