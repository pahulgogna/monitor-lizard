-- DropForeignKey
ALTER TABLE "monitor" DROP CONSTRAINT "monitor_userId_fkey";

-- AddForeignKey
ALTER TABLE "monitor" ADD CONSTRAINT "monitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
