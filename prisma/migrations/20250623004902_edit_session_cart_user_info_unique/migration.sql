/*
  Warnings:

  - A unique constraint covering the columns `[sessionId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sessionId]` on the table `UserInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionId_key" ON "Cart"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "UserInfo_sessionId_key" ON "UserInfo"("sessionId");
