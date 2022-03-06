/*
  Warnings:

  - You are about to alter the column `name` on the `Channel` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(64)`.
  - You are about to alter the column `name` on the `Guild` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(64)`.

*/
-- AlterTable
ALTER TABLE `Channel` MODIFY `name` VARCHAR(64) NOT NULL,
    MODIFY `description` TEXT NULL;

-- AlterTable
ALTER TABLE `Guild` MODIFY `name` VARCHAR(64) NOT NULL;

-- AlterTable
ALTER TABLE `Message` MODIFY `attachmentUrl` VARCHAR(2048) NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `content` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `username` VARCHAR(64) NOT NULL,
    MODIFY `password` LONGTEXT NOT NULL,
    MODIFY `avatarUrl` TEXT NULL,
    MODIFY `googleUID` VARCHAR(2048) NULL;
