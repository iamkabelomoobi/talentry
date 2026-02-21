-- Align existing Better Auth schema with current Prisma models

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'UserRole') THEN
    CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SEEKER', 'COMPANY');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AdminType') THEN
    CREATE TYPE "AdminType" AS ENUM ('SUPER_ADMIN', 'COMPANY_ADMIN');
  END IF;
END $$;

ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS "avatar" TEXT,
  ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'SEEKER';

ALTER TABLE "user"
  ALTER COLUMN "phone" DROP NOT NULL,
  ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

CREATE UNIQUE INDEX IF NOT EXISTS "user_phone_key" ON "user"("phone");
CREATE INDEX IF NOT EXISTS "user_name_idx" ON "user"("name");
CREATE INDEX IF NOT EXISTS "user_phone_idx" ON "user"("phone");
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user"("email");
CREATE INDEX IF NOT EXISTS "user_role_idx" ON "user"("role");
CREATE INDEX IF NOT EXISTS "user_createdAt_idx" ON "user"("createdAt");

CREATE TABLE IF NOT EXISTS "admin" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "type" "AdminType" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "admin_userId_key" ON "admin"("userId");
CREATE INDEX IF NOT EXISTS "admin_userId_idx" ON "admin"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'admin_userId_fkey'
  ) THEN
    ALTER TABLE "admin"
      ADD CONSTRAINT "admin_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "seeker" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "seeker_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "seeker_userId_key" ON "seeker"("userId");
CREATE INDEX IF NOT EXISTS "seeker_userId_idx" ON "seeker"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'seeker_userId_fkey'
  ) THEN
    ALTER TABLE "seeker"
      ADD CONSTRAINT "seeker_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS "company" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "company_userId_key" ON "company"("userId");
CREATE INDEX IF NOT EXISTS "company_userId_idx" ON "company"("userId");
CREATE INDEX IF NOT EXISTS "company_name_idx" ON "company"("name");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'company_userId_fkey'
  ) THEN
    ALTER TABLE "company"
      ADD CONSTRAINT "company_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
