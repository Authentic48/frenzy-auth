/*
  Warnings:

  - The primary key for the `session_access_token` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `uuid` on the `session_access_token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[access_token_uuid]` on the table `session_access_token` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[session_uuid]` on the table `session_access_token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "session_access_token" DROP CONSTRAINT "session_access_token_session_uuid_fkey";

-- DropIndex
DROP INDEX "session_device_uuid_idx";

-- DropIndex
DROP INDEX "session_access_token_access_token_uuid_session_uuid_idx";

-- AlterTable
ALTER TABLE "session_access_token" DROP CONSTRAINT "session_access_token_pkey",
DROP COLUMN "uuid",
ALTER COLUMN "session_uuid" DROP NOT NULL,
ALTER COLUMN "session_uuid" SET DATA TYPE VARCHAR(200);

-- CreateIndex
CREATE UNIQUE INDEX "session_access_token_access_token_uuid_key" ON "session_access_token"("access_token_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "session_access_token_session_uuid_key" ON "session_access_token"("session_uuid");

-- AddForeignKey
ALTER TABLE "session_access_token" ADD CONSTRAINT "session_access_token_session_uuid_fkey" FOREIGN KEY ("session_uuid") REFERENCES "session"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
