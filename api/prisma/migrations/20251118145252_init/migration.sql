/*
  Warnings:

  - The values [PUERPERA] on the enum `TipoConteudo` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipoConteudo_new" AS ENUM ('PUERPERIO', 'GESTACAO', 'DIETA', 'EXERCICIO', 'VACINA', 'EXAME', 'SINTOMAS', 'OUTROS');
ALTER TABLE "Conteudos" ALTER COLUMN "tipo_conteudo" TYPE "TipoConteudo_new" USING ("tipo_conteudo"::text::"TipoConteudo_new");
ALTER TYPE "TipoConteudo" RENAME TO "TipoConteudo_old";
ALTER TYPE "TipoConteudo_new" RENAME TO "TipoConteudo";
DROP TYPE "public"."TipoConteudo_old";
COMMIT;
