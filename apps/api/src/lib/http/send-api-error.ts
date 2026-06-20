import type { FastifyReply } from "fastify";
import type { ApiErrorResponse } from "@music-app/shared";

export function sendApiError(
  reply: FastifyReply,
  statusCode: number,
  error: string,
): void {
  const response: ApiErrorResponse = {
    success: false,
    error,
  };

  reply.code(statusCode).send(response);
}