import type { Track } from "../../generated/prisma/client.js";
import type { TrackDto } from "@music-app/shared";

export function toTrackDto(track: Track): TrackDto {
  return {
    id: track.id,
    title: track.title,
    durationSeconds: track.durationSeconds,
    trackNumber: track.trackNumber,
    discNumber: track.discNumber,

    storageKey: track.storageKey,
    originalFileName: track.originalFileName,
    mimeType: track.mimeType,
    sha256: track.sha256,

    sizeBytes: track.sizeBytes.toString(),

    status: track.status,
    artistId: track.artistId,
    albumId: track.albumId,
    uploadedById: track.uploadedById,

    createdAt: track.createdAt.toISOString(),
  };
}
