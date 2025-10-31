/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `RecoveryCode` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RecoveryCode_cpf_key" ON "RecoveryCode"("cpf");
