import type { Artist } from "../../generated/prisma/client.js";
import type { ArtistDto } from "@music-app/shared";
export function toArtistDto(artist: Artist): ArtistDto {
  return {
    id: artist.id,
    name: artist.name,
    createdAt: artist.createdAt,
    updatedAt: artist.updatedAt,
  };
}
