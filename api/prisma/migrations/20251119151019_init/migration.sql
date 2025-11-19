/*
  Warnings:

  - The values [PREMIU_ANUAL] on the enum `tipoPerfil` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "tipoPerfil_new" AS ENUM ('BASICO', 'PREMIUM', 'PREMIUM_ANUAL');
ALTER TABLE "public"."Perfil" ALTER COLUMN "tipoPerfil" DROP DEFAULT;
ALTER TABLE "Perfil" ALTER COLUMN "tipoPerfil" TYPE "tipoPerfil_new" USING ("tipoPerfil"::text::"tipoPerfil_new");
ALTER TABLE "Conteudos" ALTER COLUMN "acesso" TYPE "tipoPerfil_new" USING ("acesso"::text::"tipoPerfil_new");
ALTER TYPE "tipoPerfil" RENAME TO "tipoPerfil_old";
ALTER TYPE "tipoPerfil_new" RENAME TO "tipoPerfil";
DROP TYPE "public"."tipoPerfil_old";
ALTER TABLE "Perfil" ALTER COLUMN "tipoPerfil" SET DEFAULT 'BASICO';
COMMIT;
