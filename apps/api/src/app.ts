import fastify from "fastify";
import cookie from "@fastify/cookie";

import { healthRoutes } from "./routes/health.routes.js";
import { loginRoutes } from "./routes/login.routes.js";

export function buildApp() {
  const app = fastify({
    logger: true,
  });
  app.register(cookie);
  
  app.register(healthRoutes, {
    prefix: "/api",
  });
  app.register(loginRoutes, {
    prefix: "/api",
  });

  return app;
}
