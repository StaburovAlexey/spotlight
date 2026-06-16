-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DISABLED');

-- CreateEnum
CREATE TYPE "TrackStatus" AS ENUM ('PROCESSING', 'READY', 'FAILED');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Artist" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "releaseYear" INTEGER,
    "coverStorageKey" TEXT,
    "artistId" UUID,
    "uploadedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Track" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "durationSeconds" INTEGER,
    "trackNumber" INTEGER,
    "discNumber" INTEGER NOT NULL DEFAULT 1,
    "storageKey" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "sha256" TEXT NOT NULL,
    "status" "TrackStatus" NOT NULL DEFAULT 'READY',
    "artistId" UUID,
    "albumId" UUID,
    "uploadedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Track_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "coverStorageKey" TEXT,
    "ownerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistTrack" (
    "id" UUID NOT NULL,
    "playlistId" UUID NOT NULL,
    "trackId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaylistTrack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

-- CreateIndex
CREATE INDEX "Artist_name_idx" ON "Artist"("name");

-- CreateIndex
CREATE INDEX "Artist_deletedAt_idx" ON "Artist"("deletedAt");

-- CreateIndex
CREATE INDEX "Album_title_idx" ON "Album"("title");

-- CreateIndex
CREATE INDEX "Album_artistId_idx" ON "Album"("artistId");

-- CreateIndex
CREATE INDEX "Album_uploadedById_idx" ON "Album"("uploadedById");

-- CreateIndex
CREATE INDEX "Album_deletedAt_idx" ON "Album"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Track_storageKey_key" ON "Track"("storageKey");

-- CreateIndex
CREATE UNIQUE INDEX "Track_sha256_key" ON "Track"("sha256");

-- CreateIndex
CREATE INDEX "Track_title_idx" ON "Track"("title");

-- CreateIndex
CREATE INDEX "Track_artistId_idx" ON "Track"("artistId");

-- CreateIndex
CREATE INDEX "Track_albumId_idx" ON "Track"("albumId");

-- CreateIndex
CREATE INDEX "Track_uploadedById_idx" ON "Track"("uploadedById");

-- CreateIndex
CREATE INDEX "Track_status_idx" ON "Track"("status");

-- CreateIndex
CREATE INDEX "Track_deletedAt_idx" ON "Track"("deletedAt");

-- CreateIndex
CREATE INDEX "Playlist_ownerId_idx" ON "Playlist"("ownerId");

-- CreateIndex
CREATE INDEX "Playlist_deletedAt_idx" ON "Playlist"("deletedAt");

-- CreateIndex
CREATE INDEX "PlaylistTrack_playlistId_idx" ON "PlaylistTrack"("playlistId");

-- CreateIndex
CREATE INDEX "PlaylistTrack_trackId_idx" ON "PlaylistTrack"("trackId");

-- CreateIndex
CREATE UNIQUE INDEX "PlaylistTrack_playlistId_position_key" ON "PlaylistTrack"("playlistId", "position");

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Track" ADD CONSTRAINT "Track_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistTrack" ADD CONSTRAINT "PlaylistTrack_trackId_fkey" FOREIGN KEY ("trackId") REFERENCES "Track"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
