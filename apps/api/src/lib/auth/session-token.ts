import crypto from "node:crypto";

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
