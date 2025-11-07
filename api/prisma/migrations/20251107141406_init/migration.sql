/*
  Warnings:

  - You are about to drop the column `data` on the `Notas` table. All the data in the column will be lost.
  - Added the required column `data_criacao` to the `Notas` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "statusMaternidade" AS ENUM ('NENHUMA', 'GESTANTE', 'PUERPERA');

-- CreateEnum
CREATE TYPE "TipoParto" AS ENUM ('NORMAL', 'CESAREA', 'OUTRO');

-- CreateEnum
CREATE TYPE "GeneroBebe" AS ENUM ('MASCULINO', 'FEMININO', 'NAO_INFORMADO');

-- AlterTable
ALTER TABLE "Filhos" ADD COLUMN     "genero" "GeneroBebe",
ADD COLUMN     "peso_nascimento" DECIMAL(65,30),
ADD COLUMN     "tipo_parto" "TipoParto",
ALTER COLUMN "cpf" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Notas" DROP COLUMN "data",
ADD COLUMN     "data_criacao" DATE NOT NULL,
ADD COLUMN     "data_lembrete" DATE,
ADD COLUMN     "lembrete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Perfil" ALTER COLUMN "data_expiracao" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "dpp" TIMESTAMP(3),
ADD COLUMN     "status_maternidade" "statusMaternidade" NOT NULL DEFAULT 'NENHUMA';
