/*
  Warnings:

  - You are about to alter the column `carPark` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `highSchool` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `middleSchool` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `mosque` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `pharmacy` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `primarySchool` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `transportation` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `university` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `commercialArea` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.
  - You are about to alter the column `kindergarten` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `postdetail` MODIFY `carPark` VARCHAR(191) NULL,
    MODIFY `highSchool` VARCHAR(191) NULL,
    MODIFY `middleSchool` VARCHAR(191) NULL,
    MODIFY `mosque` VARCHAR(191) NULL,
    MODIFY `pharmacy` VARCHAR(191) NULL,
    MODIFY `primarySchool` VARCHAR(191) NULL,
    MODIFY `transportation` VARCHAR(191) NULL,
    MODIFY `university` VARCHAR(191) NULL,
    MODIFY `commercialArea` VARCHAR(191) NULL,
    MODIFY `kindergarten` VARCHAR(191) NULL;
