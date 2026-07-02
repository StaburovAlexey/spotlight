import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { requiredAuth } from "../lib/auth/required-auth.js";
import { sendApiError } from "../lib/http/send-api-error.js";
import {
  saveTemporaryFile,
  type TemporarySavedFile,
} from "../lib/storage/save-uploaded-file.js";
import {
  commitUploadedFile,
  commitUploadedFileToPath,
  fileExists,
} from "../lib/storage/save-uploaded-file.js";
import type { ApiResponse, CursorQuery, TrackDto } from "@music-app/shared";
import type {
  Album,
  Artist,
  Track,
  Prisma,
} from "../generated/prisma/client.js";

import { toTrackDto } from "../lib/audio/to-track-dto.js";
import { rm } from "node:fs/promises";
import { resolveStoragePath } from "../lib/storage/storage-path.js";
import type { FastifyRequest } from "fastify";
import { parseLimit } from "../lib/routes/queryParseLimit.js";
import { findManyWithCursor } from "../lib/storage/find-many-with-cursor.js";
type DbClient = Prisma.TransactionClient;

async function safeRemoveTmpFile(
  file: TemporarySavedFile,
  request: FastifyRequest,
): Promise<void> {
  try {
    await rm(file.tmpPath, { force: true });
  } catch (error) {
    request.log.error(error, "Failed to cleanup tmp uploaded file");
  }
}

async function safeRemoveFinalFile(
  file: TemporarySavedFile,
  request: FastifyRequest,
): Promise<void> {
  try {
    await rm(file.absolutePath, { force: true });
  } catch (error) {
    request.log.error(error, "Failed to cleanup final uploaded file");
  }
}

async function findTrackBySha256(sha256: string) {
  const existingTrack = await prisma.track.findUnique({
    where: { sha256: sha256 },
  });
  return existingTrack;
}

async function findOrCreateArtist(db: DbClient, name: string): Promise<Artist> {
  return db.artist.upsert({
    where: { name },
    create: { name },
    update: { deletedAt: null },
  });
}

function normalizeAlbumTitle(title: string): string {
  return title.trim().toLowerCase();
}

async function findOrCreateAlbum(
  db: DbClient,
  artistId: string,
  title: string,
  uploadedById: string,
): Promise<Album> {
  const titleNormalized = normalizeAlbumTitle(title);

  return db.album.upsert({
    where: {
      artistId_titleNormalized: { artistId, titleNormalized },
    },
    create: {
      title,
      titleNormalized,
      artistId,
      uploadedById,
    },
    update: {},
  });
}

async function createTrack(
  db: DbClient,
  temporaryFile: TemporarySavedFile,
  albumId: string | null,
  artistId: string | null,
  uploadedById: string,
): Promise<Track> {
  const title = temporaryFile.meta.title || temporaryFile.originalFileName;
  const durationSeconds = temporaryFile.meta.durationSeconds;
  const trackNumber = temporaryFile.meta.trackNumber;
  const storageKey = temporaryFile.storageKey;
  const originalFileName = temporaryFile.originalFileName;
  const mimeType = temporaryFile.mimeType;
  const sizeBytes = temporaryFile.sizeBytes;
  const sha256 = temporaryFile.sha256;
  const track = await db.track.create({
    data: {
      title,
      durationSeconds,
      trackNumber,
      storageKey,
      originalFileName,
      mimeType,
      sizeBytes,
      sha256,
      albumId,
      artistId,
      uploadedById,
    },
  });
  return track;
}
async function chainTracks(
  temporaryFile: TemporarySavedFile,
  uploadedById: string,
): Promise<Track> {
  return prisma.$transaction(async (tx) => {
    const metaNameArtist =
      temporaryFile.meta?.artist ?? temporaryFile.meta?.albumArtist ?? null;
    const metaAlbumName = temporaryFile.meta.album ?? "";
    const artist = metaNameArtist
      ? await findOrCreateArtist(tx, metaNameArtist)
      : null;
    const album = artist
      ? await findOrCreateAlbum(tx, artist.id, metaAlbumName, uploadedById)
      : null;
    const albumId = album?.id ?? null;
    const artistId = artist?.id ?? null;

    return createTrack(tx, temporaryFile, albumId, artistId, uploadedById);
  });
}

export async function uploadTracksRoute(app: FastifyInstance) {
  app.post<{
    Reply: ApiResponse<TrackDto>;
  }>("/upload", { preHandler: requiredAuth }, async (request, reply) => {
    let temporaryFile: TemporarySavedFile | null = null;
    let fileCommitted = false;
    let trackCreated = false;

    try {
      const userId = request.currentUser.id;
      const file = await request.file();

      if (!file) {
        sendApiError(reply, 400, "You need to upload the file.");
        return;
      }

      temporaryFile = await saveTemporaryFile(file);

      const existingTrack = await findTrackBySha256(temporaryFile.sha256);

      if (existingTrack) {
        const existingFilePath = resolveStoragePath(existingTrack.storageKey);
        const hasFileOnDisk = await fileExists(existingFilePath);

        if (hasFileOnDisk) {
          await safeRemoveTmpFile(temporaryFile, request);

          sendApiError(
            reply,
            409,
            "The audio file is already in the database.",
          );
          return;
        }
        await commitUploadedFileToPath(temporaryFile, existingFilePath);
      }

      await commitUploadedFile(temporaryFile);
      fileCommitted = true;

      const createdTrack = await chainTracks(temporaryFile, userId);
      trackCreated = true;

      return reply.code(201).send({
        success: true,
        data: toTrackDto(createdTrack),
      });
    } catch (error) {
      request.log.error(error, "Failed to upload track");

      if (temporaryFile && !fileCommitted) {
        await safeRemoveTmpFile(temporaryFile, request);
      }

      if (temporaryFile && fileCommitted && !trackCreated) {
        await safeRemoveFinalFile(temporaryFile, request);
      }

      sendApiError(reply, 500, "Failed to upload track.");
    }
  });
}

export async function getTracksRoute(app: FastifyInstance) {
  app.get<{
    Querystring: CursorQuery;
    Reply: ApiResponse<{
      items: TrackDto[];
      nextCursor: string | null;
    }>;
  }>("/", { preHandler: requiredAuth }, async (request, reply) => {
    const { items: tracks, nextCursor } = await findManyWithCursor(
      request,
      "track",
    );

    reply.code(200).send({
      success: true,
      data: { items: tracks.map(toTrackDto), nextCursor },
    });
  });
}
