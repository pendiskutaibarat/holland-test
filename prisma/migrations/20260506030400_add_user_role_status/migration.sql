-- Rename admins table to users
ALTER TABLE "admins" RENAME TO "users";

-- Add role and status columns with defaults for existing rows
ALTER TABLE "users" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'ADMIN';
ALTER TABLE "users" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'ACTIVE';

-- Rename admin_id to user_id in sessions table
ALTER TABLE "sessions" RENAME COLUMN "admin_id" TO "user_id";

-- Drop old foreign key constraint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_admin_id_fkey";

-- Add new foreign key constraint referencing users
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Rename unique index on email
ALTER INDEX "admins_email_key" RENAME TO "users_email_key";
