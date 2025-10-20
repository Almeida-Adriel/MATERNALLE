-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENTE', 'ADMIN');

-- AlterTable
ALTER TABLE "Usuarios" ADD COLUMN     "endereco" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CLIENTE',
ADD COLUMN     "telefone" TEXT;
