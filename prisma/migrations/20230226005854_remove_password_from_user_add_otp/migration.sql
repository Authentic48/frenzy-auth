/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "password";

-- CreateTable
CREATE TABLE "otp" (
    "uuid" VARCHAR(36) NOT NULL,
    "password" TEXT NOT NULL,
    "user_uuid" VARCHAR(36) NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "otp_user_uuid_key" ON "otp"("user_uuid");

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
