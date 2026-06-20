import { FastifyRequest, FastifyReply } from "fastify";
import { hashSessionToken } from "./session-token.js";
import { prisma } from "../prisma.js";
import { sendApiError } from "../http/send-api-error.js";
import { getSession, type SessionWithUser } from "./session-token.js";

function isSessionInvalid(session: SessionWithUser): boolean {
  return session.revokedAt !== null || session.expiresAt <= new Date();
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

  if (isSessionInvalid(session)) {
    sendApiError(reply, 401, "The session has expired. Please log in again.");
    return;
  }

  if (session.user.status === "DISABLED") {
    sendApiError(reply, 403, "User is disabled");
    return;
  }

  request.currentSession = session;
  request.currentUser = session.user;
}
