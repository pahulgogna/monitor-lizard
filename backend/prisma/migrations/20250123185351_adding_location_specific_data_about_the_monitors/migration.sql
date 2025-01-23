/*
  Warnings:

  - You are about to drop the column `responseTime` on the `monitor` table. All the data in the column will be lost.
  - You are about to drop the column `running` on the `monitor` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `monitor` table. All the data in the column will be lost.
  - Added the required column `centralIndia` to the `monitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eastUS` to the `monitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseTimeEU` to the `monitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseTimeIN` to the `monitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseTimeUS` to the `monitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `westEurope` to the `monitor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "monitor" DROP COLUMN "responseTime",
DROP COLUMN "running",
DROP COLUMN "status",
ADD COLUMN     "centralIndia" INTEGER NOT NULL,
ADD COLUMN     "eastUS" INTEGER NOT NULL,
ADD COLUMN     "responseTimeEU" INTEGER NOT NULL,
ADD COLUMN     "responseTimeIN" INTEGER NOT NULL,
ADD COLUMN     "responseTimeUS" INTEGER NOT NULL,
ADD COLUMN     "runningEU" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "runningIN" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "runningUS" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "westEurope" INTEGER NOT NULL;
