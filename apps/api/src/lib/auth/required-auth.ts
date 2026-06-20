import { FastifyRequest, FastifyReply } from "fastify";
import { hashSessionToken } from "./session-token.js";
import { prisma } from "../prisma.js";
import { sendApiError } from "../http/send-api-error.js";
import type { Prisma } from "../../generated/prisma/client.js";
import type { Session, User } from "../../generated/prisma/client.js";

type SessionWithUser = Prisma.SessionGetPayload<{
  include: {
    user: true;
  };
}>;

async function getSession(token: string): Promise<SessionWithUser | null> {
  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  return session;
}

function checkSession(session: SessionWithUser, reply: FastifyReply) {
  if (session.revokedAt !== null || session.expiresAt <= new Date()) {
    sendApiError(reply, 401, "The session has expired. Please log in again.");
    return;
  }
  if (session.user.status === "DISABLED") {
    sendApiError(reply, 403, "User is disabled");
    return;
  }
}
export async function requiredAuth(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.cookies.session;
  if (!token) {
    sendApiError(reply, 401, "The session has expired. Please log in again.");
    return;
  }

  const session = await getSession(token);
  if (!session) {
    sendApiError(reply, 401, "The session has expired. Please log in again.");
    return;
  }

  checkSession(session, reply);
  request.currentSession = session;
  request.currentUser = session.user;
}
