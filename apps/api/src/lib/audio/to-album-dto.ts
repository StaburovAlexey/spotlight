
import type { AlbumWithArtistDto } from "@music-app/shared";
import type { Prisma } from "../../generated/prisma/client.js";
export type AlbumWithArtist = Prisma.AlbumGetPayload<{
  include: {
    artist: true;
  };
}>;
export function toAlbumWithArtistDto(
  album: AlbumWithArtist,
): AlbumWithArtistDto {
  return {
    id: album.id,
    title: album.title,
    titleNormalized: album.titleNormalized,
    artistId: album.artistId,
    artistName: album.artist?.name ?? null,
    uploadedById: album.uploadedById,
    createdAt: album.createdAt.toISOString(),
  };
}
