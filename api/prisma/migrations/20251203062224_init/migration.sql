-- CreateTable
CREATE TABLE "Edimburgo" (
    "id" TEXT NOT NULL,
    "id_usuario" TEXT NOT NULL,
    "q1" TEXT NOT NULL,
    "q2" TEXT NOT NULL,
    "q3" TEXT NOT NULL,
    "q4" TEXT NOT NULL,
    "q5" TEXT NOT NULL,
    "q6" TEXT NOT NULL,
    "q7" TEXT NOT NULL,
    "q8" TEXT NOT NULL,
    "q9" TEXT NOT NULL,

    CONSTRAINT "Edimburgo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Edimburgo_id_usuario_idx" ON "Edimburgo"("id_usuario");

-- AddForeignKey
ALTER TABLE "Edimburgo" ADD CONSTRAINT "Edimburgo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
