-- CreateEnum
CREATE TYPE "RoleEnum" AS ENUM ('USER', 'ADMIN', 'MANAGER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateTable
CREATE TABLE "user" (
    "uuid" VARCHAR(36) NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "role" (
    "uuid" VARCHAR(36) NOT NULL,
    "name" "RoleEnum" NOT NULL DEFAULT 'USER',
    "user_uuid" VARCHAR(36) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "session" (
    "uuid" VARCHAR(36) NOT NULL,
    "user_uuid" VARCHAR(36) NOT NULL,
    "device_uuid" VARCHAR(36) NOT NULL,
    "refresh_token" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "session_access_token" (
    "uuid" VARCHAR(36) NOT NULL,
    "session_uuid" VARCHAR(36) NOT NULL,
    "access_token_uuid" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expired_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_access_token_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "session_device_uuid_key" ON "session"("device_uuid");

-- CreateIndex
CREATE UNIQUE INDEX "session_refresh_token_key" ON "session"("refresh_token");

-- CreateIndex
CREATE INDEX "session_device_uuid_idx" ON "session"("device_uuid");

-- CreateIndex
CREATE INDEX "session_access_token_access_token_uuid_session_uuid_idx" ON "session_access_token"("access_token_uuid", "session_uuid");

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session_access_token" ADD CONSTRAINT "session_access_token_session_uuid_fkey" FOREIGN KEY ("session_uuid") REFERENCES "session"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
