import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { requiredAuth } from "../lib/auth/required-auth.js";
import { sendApiError } from "../lib/http/send-api-error.js";
import {
  saveTemporaryFile,
  type TemporarySavedFile,
} from "../lib/storage/save-uploaded-file.js";
import type { ApiResponse } from "@music-app/shared";
import type { Album, Artist, Track } from "../generated/prisma/client.js";
import type { TrackDto } from "@music-app/shared";
import { toTrackDto } from "../lib/audio/to-track-dto.js";
async function findTrackBySha256(sha256: string) {
  const existingTrack = await prisma.track.findUnique({
    where: { sha256: sha256 },
  });
  return existingTrack;
}

async function findOrCreateArtist(name: string): Promise<Artist> {
  const existingArtist = await prisma.artist.findFirst({
    where: {
      name,
      deletedAt: null,
    },
  });

  if (existingArtist) {
    return existingArtist;
  }

  return prisma.artist.create({
    data: {
      name,
    },
  });
}

async function findOrCreateAlbum(
  artistId: string,
  title: string,
  uploadedById: string,
): Promise<Album> {
  const existingAlbum = await prisma.album.findFirst({
    where: { artistId, title },
  });
  if (existingAlbum) return existingAlbum;
  return prisma.album.create({
    data: {
      title,
      artistId,
      uploadedById,
    },
  });
}

async function createTrack(
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
  const track = await prisma.track.create({
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
  const metaNameArtist =
    temporaryFile.meta?.artist ?? temporaryFile.meta?.albumArtist ?? null;
  const metaAlbumName = temporaryFile.meta.album ?? "";
  const artist = metaNameArtist
    ? await findOrCreateArtist(metaNameArtist)
    : null;
  const album = artist
    ? await findOrCreateAlbum(artist.id, metaAlbumName, uploadedById)
    : null;
  const albumId = album?.id ?? null;
  const artistId = artist?.id ?? null;
  const track = await createTrack(
    temporaryFile,
    albumId,
    artistId,
    uploadedById,
  );

  return track;
}

export async function uploadTracksRoute(app: FastifyInstance) {
  app.post<{
    Reply: ApiResponse<TrackDto>;
  }>("/upload", { preHandler: requiredAuth }, async (request, reply) => {
    const userId = request.currentUser.id;
    const file = await request.file();

    if (!file) {
      sendApiError(reply, 400, "You need to upload the file.");
      return;
    }
    const temporaryFile = await saveTemporaryFile(file);
    const track = await findTrackBySha256(temporaryFile.sha256);
    if (track) {
      return reply.code(409).send({
        success: false,
        error: "The audio file is already in the database.",
      });
    }
    const createdTrack = await chainTracks(temporaryFile, userId);

    return reply.code(200).send({
      success: true,
      data: toTrackDto(createdTrack),
    });
  });
}

export async function getTracksRoute(app: FastifyInstance) {
  app.get<{ Reply: ApiResponse<TrackDto[]> }>(
    "/",
    { preHandler: requiredAuth },
    async (request, reply) => {
      const tracks = await prisma.track.findMany({
        where: { deletedAt: null },
        orderBy: {
          createdAt: "desc",
        },
      });
      reply.code(200).send({
        success: true,
        data: tracks.map(toTrackDto),
      });
    },
  );
}
