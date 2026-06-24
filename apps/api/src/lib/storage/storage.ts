import "dotenv/config";
import path from "node:path";

export function getStoragePath() {
  const { STORAGE_ROOT } = process.env;
  const storage = STORAGE_ROOT ? STORAGE_ROOT : "../../storage/music";
  return path.resolve(process.cwd(), storage);
}
