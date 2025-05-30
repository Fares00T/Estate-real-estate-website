/*
  Warnings:

  - You are about to drop the column `bus` on the `postdetail` table. All the data in the column will be lost.
  - You are about to drop the column `school` on the `postdetail` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `postdetail` DROP COLUMN `bus`,
    DROP COLUMN `school`,
    ADD COLUMN `Furnished` VARCHAR(191) NULL,
    ADD COLUMN `Matricule` VARCHAR(191) NULL,
    ADD COLUMN `carPark` VARCHAR(191) NULL,
    ADD COLUMN `commercial` VARCHAR(191) NULL,
    ADD COLUMN `highSchool` VARCHAR(191) NULL,
    ADD COLUMN `middleSchool` VARCHAR(191) NULL,
    ADD COLUMN `mosque` VARCHAR(191) NULL,
    ADD COLUMN `pharmacy` VARCHAR(191) NULL,
    ADD COLUMN `primarySchool` VARCHAR(191) NULL,
    ADD COLUMN `transportation` VARCHAR(191) NULL,
    ADD COLUMN `university` VARCHAR(191) NULL;
