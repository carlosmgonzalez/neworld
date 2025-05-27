-- CreateTable
CREATE TABLE "Provinces" (
    "id" INTEGER NOT NULL,
    "province" VARCHAR(255) NOT NULL,

    CONSTRAINT "Provinces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localities" (
    "id" INTEGER NOT NULL,
    "id_province" INTEGER NOT NULL,
    "locality" VARCHAR(255) NOT NULL,

    CONSTRAINT "Localities_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Localities" ADD CONSTRAINT "Localities_id_province_fkey" FOREIGN KEY ("id_province") REFERENCES "Provinces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
