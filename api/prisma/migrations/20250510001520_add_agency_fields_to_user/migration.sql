/*
  Warnings:

  - The values [apartment,house,condo,land] on the enum `Post_property` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `propertyType` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `post` ADD COLUMN `propertyType` ENUM('office', 'retail', 'hospitality', 'industrial', 'apartment', 'individual_house', 'traditional_house', 'other_residential') NOT NULL,
    MODIFY `property` ENUM('commercial', 'residential') NOT NULL;
