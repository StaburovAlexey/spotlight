import crypto from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";

export type SessionWithUser = Prisma.SessionGetPayload<{
  include: {
    user: true;
  };
}>;

export type SessionTokenPair = {
  token: string;
  tokenHash: string;
};

export function generateSessionToken(): SessionTokenPair {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, tokenHash };
}

export function hashSessionToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function getSession(token: string): Promise<SessionWithUser | null> {
  const tokenHash = hashSessionToken(token);
  const session = await prisma.session.findUnique({
    where: { tokenHash },
    include: { user: true },
  });
  return session;
}