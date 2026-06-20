import type { Session, User } from "../generated/prisma/client.js";

declare module "fastify" {
  interface FastifyRequest {
    currentUser?: User;
    currentSession?: Session;
  }
}
