/*
  Warnings:

  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `UnsignedInt` to `UnsignedBigInt`.
  - You are about to alter the column `authorId` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `Int` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `Message` DROP PRIMARY KEY,
    MODIFY `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Post` MODIFY `authorId` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `archived` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `online` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Relationships` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `friendId` INTEGER UNSIGNED NOT NULL,

    INDEX `Relationships_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `guildId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
