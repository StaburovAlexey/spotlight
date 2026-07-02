import fastify from "fastify";
import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";

import { healthRoutes } from "./routes/health.routes.js";
import { loginRoutes } from "./routes/login.routes.js";
import { meRoute } from "./routes/me.routes.js";
import { logoutRoutes } from "./routes/logout.routes.js";
import { uploadTracksRoute, getTracksRoute } from "./routes/tracks.routes.js";
import { sendApiError } from "./lib/http/send-api-error.js";
import { getArtistRoute } from "./routes/artist.routes.js";
import { getAlbumsRoute } from "./routes/album.routes.js";
export function buildApp() {
  const app = fastify({
    logger: true,
    bodyLimit: 200 * 1024 * 1024,
  });
  app.register(cookie);
  app.register(multipart);

  app.register(healthRoutes, {
    prefix: "/api",
  });
  app.register(loginRoutes, {
    prefix: "/api/auth",
  });
  app.register(meRoute, { prefix: "/api/auth" });
  app.register(logoutRoutes, { prefix: "/api/auth" });

  app.register(uploadTracksRoute, { prefix: "/api/tracks" });
  app.register(getTracksRoute, { prefix: "/api/tracks" });
  app.register(getAlbumsRoute, { prefix: "/api/albums" });
  app.register(getArtistRoute, { prefix: "/api/artists" });
  
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    return sendApiError(reply, 500, "Internal server error");
  });
  return app;
}
