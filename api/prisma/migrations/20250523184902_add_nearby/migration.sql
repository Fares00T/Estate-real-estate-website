/*
  Warnings:

  - You are about to drop the column `commercial` on the `postdetail` table. All the data in the column will be lost.
  - You are about to drop the column `income` on the `postdetail` table. All the data in the column will be lost.
  - You are about to drop the column `restaurant` on the `postdetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `postdetail` DROP COLUMN `commercial`,
    DROP COLUMN `income`,
    DROP COLUMN `restaurant`,
    ADD COLUMN `commercialArea` VARCHAR(191) NULL,
    ADD COLUMN `kindergarten` VARCHAR(191) NULL;
