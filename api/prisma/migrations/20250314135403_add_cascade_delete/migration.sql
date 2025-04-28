-- DropForeignKey
ALTER TABLE `postdetail` DROP FOREIGN KEY `PostDetail_postId_fkey`;

-- AddForeignKey
ALTER TABLE `PostDetail` ADD CONSTRAINT `PostDetail_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
