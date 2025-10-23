/*
  Warnings:

  - You are about to drop the column `role` on the `Usuarios` table. All the data in the column will be lost.
  - You are about to drop the `Recem_nascidos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `Usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `Usuarios` table without a default value. This is not possible if the table is not empty.
  - Made the column `endereco` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefone` on table `Usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "role" AS ENUM ('CLIENTE', 'ADMIN');

-- CreateEnum
CREATE TYPE "tipoPerfil" AS ENUM ('BASICO', 'PREMIUM', 'PREMIU_ANUAL');

-- DropForeignKey
ALTER TABLE "public"."Recem_nascidos" DROP CONSTRAINT "Recem_nascidos_id_usuario_fkey";

-- DropIndex
DROP INDEX "public"."Usuarios_email_key";

-- AlterTable
ALTER TABLE "Usuarios" DROP COLUMN "role",
ADD COLUMN     "cpf" TEXT NOT NULL,
ALTER COLUMN "endereco" SET NOT NULL,
ALTER COLUMN "telefone" SET NOT NULL;

-- DropTable
DROP TABLE "public"."Recem_nascidos";

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "Perfil" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "tipoPerfil" "tipoPerfil" NOT NULL,
    "role" "role" NOT NULL,
    "data_expiracao" DATE NOT NULL,

    CONSTRAINT "Perfil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filhos" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "data_nascimento" DATE NOT NULL,

    CONSTRAINT "Filhos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Perfil_id_usuario_key" ON "Perfil"("id_usuario");

-- CreateIndex
CREATE INDEX "Perfil_id_usuario_idx" ON "Perfil"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Filhos_cpf_key" ON "Filhos"("cpf");

-- CreateIndex
CREATE INDEX "Filhos_id_usuario_idx" ON "Filhos"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_cpf_key" ON "Usuarios"("cpf");

-- AddForeignKey
ALTER TABLE "Perfil" ADD CONSTRAINT "Perfil_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filhos" ADD CONSTRAINT "Filhos_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
