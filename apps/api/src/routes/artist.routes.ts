import type { ApiResponse, ArtistDto, CursorQuery } from "@music-app/shared";
import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { requiredAuth } from "../lib/auth/required-auth.js";
import { toArtistDto } from "../lib/audio/to-artist-dto.js";
import { parseLimit } from "../lib/routes/queryParseLimit.js";
import { findManyWithCursor } from "../lib/storage/find-many-with-cursor.js";
export async function getArtistRoute(app: FastifyInstance) {
  app.get<{
    Querystring: CursorQuery;
    Reply: ApiResponse<{
      items: ArtistDto[];
      nextCursor: string | null;
    }>;
  }>(
    "/",
    {
      preHandler: requiredAuth,
    },
    async (request, reply) => {
      const { items: artists, nextCursor } = await findManyWithCursor(
        request,
        "artist",
      );
      reply.code(200).send({
        success: true,
        data: { items: artists.map(toArtistDto), nextCursor },
      });
    },
  );
}
