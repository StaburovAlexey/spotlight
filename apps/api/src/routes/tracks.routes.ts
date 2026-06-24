import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { requiredAuth } from "../lib/auth/required-auth.js";
import { sendApiError } from "../lib/http/send-api-error.js";
import { saveTemporaryFile } from "../lib/storage/save-uploaded-file.js";
import type { TrackUploadDebugDto } from "@music-app/shared";
import type { ApiResponse } from "@music-app/shared";
import type { MultipartFile } from "@fastify/multipart";

function transformFileDescription(file: MultipartFile): TrackUploadDebugDto {
  return {
    mimetype: file.mimetype,
    filename: file.filename,
    encoding: file.encoding,
  };
}
export async function uploadTracks(app: FastifyInstance) {
  app.post<{
    // Reply: ApiResponse<TrackUploadDebugDto>;
  }>("/upload", { preHandler: requiredAuth }, async (request, reply) => {
    const file = await request.file();

    if (!file) {
      sendApiError(reply, 400, "You need to upload the file.");
      return;
    }
    const {
      mimeType,
      originalFileName,
      sha256,
      sizeBytes,
      absolutePath,
      storageKey,
      meta
    } = await saveTemporaryFile(file);
    return reply.code(200).send({
      success: true,
      data: {
        mimeType,
        storageKey,
        absolutePath,
        originalFileName,
        sha256,
        sizeBytes: sizeBytes.toString(),
        meta
      },
    });
  });
}
