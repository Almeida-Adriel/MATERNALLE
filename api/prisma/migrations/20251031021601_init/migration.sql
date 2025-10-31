/*
  Warnings:

  - You are about to drop the column `email` on the `RecoveryCode` table. All the data in the column will be lost.
  - Added the required column `cpf` to the `RecoveryCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RecoveryCode" DROP COLUMN "email",
ADD COLUMN     "cpf" TEXT NOT NULL;
