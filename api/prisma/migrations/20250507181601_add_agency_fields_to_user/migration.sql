/*
  Warnings:

  - You are about to drop the column `city` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `city`,
    DROP COLUMN `district`,
    ADD COLUMN `location` VARCHAR(191) NULL;
