import type { FastifyInstance } from "fastify";
import type { LogoutResponse } from "@music-app/shared";
import {
  hashSessionToken,
  type SessionWithUser,
} from "../lib/auth/session-token.js";
import { prisma } from "../lib/prisma.js";

export async function logoutRoutes(app: FastifyInstance) {
  app.post<{
    Reply: LogoutResponse;
  }>("/logout", async (request, reply) => {
    const token = request.cookies.session;
    if (token) {
      const tokenHash = hashSessionToken(token);
      prisma.session.updateMany({
        where: {
          tokenHash,
          revokedAt: null,
        },
        data: {
          revokedAt: new Date(),
        },
      });
    }
    reply.clearCookie("session", {
      path: "/",
    });
    return reply.code(401).send({
      success: true,
      data: {
        ok: true,
      },
    });
  });
}
