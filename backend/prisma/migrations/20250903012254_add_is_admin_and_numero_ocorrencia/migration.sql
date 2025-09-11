-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "numeroOcorrencia" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "Item_publicado_achadoEm_idx" ON "Item"("publicado", "achadoEm");
