/*
  Warnings:

  - Made the column `data_expiracao` on table `Perfil` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Perfil" ALTER COLUMN "tipoPerfil" SET DEFAULT 'BASICO',
ALTER COLUMN "data_expiracao" SET NOT NULL;

-- AlterTable
ALTER TABLE "Usuarios" ALTER COLUMN "lastLoginAt" SET DATA TYPE TIMESTAMP(3);
