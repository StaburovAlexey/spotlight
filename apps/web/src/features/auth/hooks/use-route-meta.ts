import { useMatches } from "react-router-dom";
import type { AppRouteHandle } from "../../../app/router/router";
function isAppRouteHandle(handle: unknown): handle is AppRouteHandle {
  return typeof handle === "object" && handle !== null;
}
export function useRouteMeta(): AppRouteHandle {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const handle = isAppRouteHandle(currentMatch?.handle)
    ? currentMatch.handle
    : {};

  return handle;
}
