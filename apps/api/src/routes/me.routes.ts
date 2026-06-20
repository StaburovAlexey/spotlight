import type { FastifyInstance } from "fastify";
import type { MeResponse } from "@music-app/shared";
import { toUserDto } from "../lib/auth/to-user-dto.js";
import { requiredAuth } from "../lib/auth/required-auth.js";

export async function meRoute(app: FastifyInstance) {
  app.get<{ Reply: MeResponse }>(
    "/me",
    {
      preHandler: requiredAuth,
    },
    async (request, reply) => {
      return reply.status(200).send({
        success: true,
        data: toUserDto(request.currentUser),
      });
    },
  );
}
