/*
  Warnings:

  - You are about to drop the column `endereco` on the `Imovel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Imovel" DROP COLUMN "endereco",
ADD COLUMN     "bairro" TEXT,
ADD COLUMN     "cep" TEXT,
ADD COLUMN     "cidade" TEXT,
ADD COLUMN     "numero" TEXT,
ADD COLUMN     "rua" TEXT;

-- AlterTable
ALTER TABLE "Inquilino" ADD COLUMN     "imovelId" INTEGER;

-- AddForeignKey
ALTER TABLE "Inquilino" ADD CONSTRAINT "Inquilino_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
