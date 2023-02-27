-- DropForeignKey
ALTER TABLE "otp" DROP CONSTRAINT "otp_user_uuid_fkey";

-- DropForeignKey
ALTER TABLE "role" DROP CONSTRAINT "role_user_uuid_fkey";

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role" ADD CONSTRAINT "role_user_uuid_fkey" FOREIGN KEY ("user_uuid") REFERENCES "user"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
