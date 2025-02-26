-- CreateTable
CREATE TABLE "Manutencao" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "comodo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "inquilinoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Manutencao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Manutencao" ADD CONSTRAINT "Manutencao_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Manutencao" ADD CONSTRAINT "Manutencao_inquilinoId_fkey" FOREIGN KEY ("inquilinoId") REFERENCES "Inquilino"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
