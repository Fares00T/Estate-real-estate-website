/*
  Warnings:

  - You are about to alter the column `carPark` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `highSchool` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `middleSchool` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `mosque` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `pharmacy` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `primarySchool` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `transportation` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `university` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `commercialArea` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.
  - You are about to alter the column `kindergarten` on the `postdetail` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `postdetail` MODIFY `carPark` BOOLEAN NULL,
    MODIFY `highSchool` BOOLEAN NULL,
    MODIFY `middleSchool` BOOLEAN NULL,
    MODIFY `mosque` BOOLEAN NULL,
    MODIFY `pharmacy` BOOLEAN NULL,
    MODIFY `primarySchool` BOOLEAN NULL,
    MODIFY `transportation` BOOLEAN NULL,
    MODIFY `university` BOOLEAN NULL,
    MODIFY `commercialArea` BOOLEAN NULL,
    MODIFY `kindergarten` BOOLEAN NULL;
