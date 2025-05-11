/*
  Warnings:

  - You are about to drop the column `location` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `location`,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `district` VARCHAR(191) NULL;
