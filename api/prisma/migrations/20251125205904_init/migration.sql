/*
  Warnings:

  - You are about to drop the column `role` on the `Perfil` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Perfil" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "role" "role" NOT NULL DEFAULT 'CLIENTE';
