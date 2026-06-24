import path from "node:path";
import { getStoragePath } from "./storage.js";

export function getFileExtension(filename: string):string {
  const extension = path.extname(filename).toLowerCase();
  if (extension) return extension;

  return ".bin";
}

export function buildOriginalStorageKey(sha256: string, extension: string):string {
  const firstTwo = sha256.slice(0, 2);
  const secondTwo = sha256.slice(2, 4);
  const storageKey = `originals/${firstTwo}/${secondTwo}/${sha256}${extension}`;
  return storageKey;
}
export function resolveStoragePath(storageKey: string):string {
  const storage = getStoragePath();
  return path.join(storage, storageKey);
}
