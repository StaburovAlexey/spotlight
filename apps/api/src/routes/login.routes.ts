import type { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma.js";
import { verify } from "argon2";
import { generateSessionToken } from "../lib/auth/session-token.js";
import { toUserDto } from "../lib/auth/to-user-dto.js";
import type { LoginRequest, LoginResponse, UserDto } from "@music-app/shared";
import type { Session, User } from "../generated/prisma/client.js";

const loginSchema = {
  body: {
    type: "object",
    required: ["login", "password"],
    additionalProperties: false,
    properties: {
      login: { type: "string", minLength: 1 },
      password: { type: "string", minLength: 1 },
    },
  },
} as const;

async function findUser(login: LoginRequest["login"]): Promise<User | null> {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: login }, { username: login }],
    },
  });
  return existingUser;
}
async function verifyPassword(
  passwordHash: User["passwordHash"],
  password: LoginRequest["password"],
) {
  const verifyPassword = await verify(passwordHash, password);
  return verifyPassword;
}
function isDisabledUser(status: User["status"]) {
  return status === "DISABLED";
}

async function createSession(user: User, tokenHash: string): Promise<Session> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const session = await prisma.session.create({
    data: {
      tokenHash: tokenHash,
      userId: user.id,
      expiresAt: expiresAt,
    },
  });
  return session;
}

export async function loginRoutes(app: FastifyInstance) {
  app.post<{
    Body: LoginRequest;
    Reply: LoginResponse;
  }>("/login", { schema: loginSchema }, async (request, reply) => {
    const { login, password } = request.body;
    const user = await findUser(login);
    if (!user) {
      return reply
        .code(401)
        .send({ success: false, error: "Invalid username or password" });
    }
    const verify = await verifyPassword(user.passwordHash, password);
    if (!verify) {
      return reply
        .code(401)
        .send({ success: false, error: "Invalid username or password" });
    }
    if (isDisabledUser(user.status)) {
      return reply
        .code(403)
        .send({ success: false, error: "User is disabled" });
    }
    const { token, tokenHash } = generateSessionToken();
    await createSession(user, tokenHash);
    reply.setCookie("session", token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 24 * 7,
    });
    reply.code(200).send({
      success: true,
      data: toUserDto(user),
    });
  });
}
