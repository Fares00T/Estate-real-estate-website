-- CreateTable
CREATE TABLE `TourRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `propertyId` INTEGER NOT NULL,
    `clientId` INTEGER NOT NULL,
    `agencyId` INTEGER NOT NULL,
    `preferredDate` VARCHAR(191) NOT NULL,
    `preferredTime` VARCHAR(191) NOT NULL,
    `contactPhone` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NULL,
    `status` ENUM('pending', 'confirmed', 'declined', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
    `confirmedDate` VARCHAR(191) NULL,
    `confirmedTime` VARCHAR(191) NULL,
    `declineReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TourRequest` ADD CONSTRAINT `TourRequest_propertyId_fkey` FOREIGN KEY (`propertyId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourRequest` ADD CONSTRAINT `TourRequest_clientId_fkey` FOREIGN KEY (`clientId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TourRequest` ADD CONSTRAINT `TourRequest_agencyId_fkey` FOREIGN KEY (`agencyId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
