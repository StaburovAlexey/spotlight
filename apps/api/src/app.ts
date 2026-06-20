import fastify from "fastify";
import cookie from "@fastify/cookie";

import { healthRoutes } from "./routes/health.routes.js";
import { loginRoutes } from "./routes/login.routes.js";
import { meRoute } from "./routes/me.routes.js";
export function buildApp() {
  const app = fastify({
    logger: true,
  });
  app.register(cookie);

  app.register(healthRoutes, {
    prefix: "/api",
  });
  app.register(loginRoutes, {
    prefix: "/api/auth/",
  });
  app.register(meRoute, { prefix: "/api/auth/" });

  return app;
}
