/*
  Warnings:

  - You are about to drop the `tourrequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tourrequest` DROP FOREIGN KEY `TourRequest_postId_fkey`;

-- DropForeignKey
ALTER TABLE `tourrequest` DROP FOREIGN KEY `TourRequest_userId_fkey`;

-- DropTable
DROP TABLE `tourrequest`;
