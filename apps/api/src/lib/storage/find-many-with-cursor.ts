import { CursorQuery, AlbumWithArtistDto } from "@music-app/shared";
import { prisma } from "../../lib/prisma.js";
import { parseLimit } from "../routes/queryParseLimit.js";
import type { FastifyRequest } from "fastify";
import type { Artist, Album, Track } from "../../generated/prisma/client.js"; // Импортируем типы моделей
import type { AlbumWithArtist } from "../audio/to-album-dto.js";
const modelMap = {
  artist: prisma.artist,
  album: prisma.album,
  track: prisma.track,
} as const;

type EntityName = keyof typeof modelMap;
type FindManyWithCursor = FastifyRequest<{
  Querystring: CursorQuery;
}>;

export async function findManyWithCursor(
  request: FindManyWithCursor,
  model: "artist",
): Promise<{ items: Artist[]; nextCursor: string | null }>;
export async function findManyWithCursor(
  request: FindManyWithCursor,
  model: "album",
): Promise<{ items: AlbumWithArtist[]; nextCursor: string | null }>;
export async function findManyWithCursor(
  request: FindManyWithCursor,
  model: "track",
): Promise<{ items: Track[]; nextCursor: string | null }>;

export async function findManyWithCursor(
  request: FindManyWithCursor,
  model: EntityName,
): Promise<{ items: any[]; nextCursor: string | null }> {
  const limit = parseLimit(request.query.limit);
  const cursor = request.query.cursor;

  const currentModel = modelMap[model] as any;

  const array = await currentModel.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    include:
      model === "album"
        ? {
            artist: true,
          }
        : {},
    take: limit + 1,
    ...(cursor
      ? {
          cursor: {
            id: cursor,
          },
          skip: 1,
        }
      : {}),
  });

  const hasNextPage = array.length > limit;
  const items = hasNextPage ? array.slice(0, limit) : array;

  const nextCursor = hasNextPage ? (items[items.length - 1]?.id ?? null) : null;
  return { items, nextCursor };
}
