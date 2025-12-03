/*
  Warnings:

  - Added the required column `resposta` to the `Edimburgo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Edimburgo" ADD COLUMN     "resposta" TEXT NOT NULL;
