import { requiredAuth } from "../lib/auth/required-auth.js";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { toAlbumWithArtistDto } from "../lib/audio/to-album-dto.js";
import type {
  ApiResponse,
  AlbumWithArtistDto,
  CursorQuery,
} from "@music-app/shared";
import { parseLimit } from "../lib/routes/queryParseLimit.js";
import { findManyWithCursor } from "../lib/storage/find-many-with-cursor.js";

export async function getAlbumsRoute(app: FastifyInstance) {
  app.get<{
    Querystring: CursorQuery;
    Reply: ApiResponse<{
      items: AlbumWithArtistDto[];
      nextCursor: string | null;
    }>;
  }>("/", { preHandler: requiredAuth }, async (request, reply) => {
    const { items: albums, nextCursor } = await findManyWithCursor(
      request,
      "album",
    );
    reply.code(200).send({
      success: true,
      data: { items: albums.map(toAlbumWithArtistDto), nextCursor },
    });
  });
}
