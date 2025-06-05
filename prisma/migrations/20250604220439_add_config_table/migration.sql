-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "configKey" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Config_configKey_key" ON "Config"("configKey");
