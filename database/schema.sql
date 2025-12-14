-- =============================================================================
-- DATABASE SCHEMA FOR FOOD FINDER APP
-- PostgreSQL Database Schema
-- Generated from Prisma Schema
-- =============================================================================

-- Drop tables if they exist (in correct order due to foreign keys)
DROP TABLE IF EXISTS "VerificationToken" CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- =============================================================================
-- CREATE TABLES
-- =============================================================================

-- User Table
-- Stores user account information including authentication details
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Unique constraint on email
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Account Table
-- Stores OAuth provider account information (for future OAuth integration)
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- Unique constraint on provider + providerAccountId
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- Foreign key constraint
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Session Table
-- Stores user session information for authentication
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- Unique constraint on sessionToken
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- Foreign key constraint
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" 
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- VerificationToken Table
-- Stores email verification tokens
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Unique constraints
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- =============================================================================
-- SAMPLE DATA (Optional - for testing purposes)
-- =============================================================================

-- Sample user (password is 'password123' hashed with bcrypt)
-- Note: In production, never include real passwords in scripts
INSERT INTO "User" ("id", "name", "email", "password", "createdAt", "updatedAt")
VALUES (
    'cltest123456789',
    'Test User',
    'test@example.com',
    '$2a$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/FeC9.gOMvlvO1m',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- =============================================================================
-- NOTES
-- =============================================================================
-- 
-- This database uses PostgreSQL
-- The schema is managed by Prisma ORM
-- 
-- To apply this schema using Prisma:
--   npx prisma migrate dev --name init
--
-- To reset the database:
--   npx prisma migrate reset
--
-- To generate Prisma client:
--   npx prisma generate
--
-- =============================================================================
