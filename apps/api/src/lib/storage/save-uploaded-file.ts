import { createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { mkdir, rename } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getStoragePath } from "./storage.js";
import {
  getFileExtension,
  buildOriginalStorageKey,
  resolveStoragePath,
} from "./storage-path.js";
import { readAudioMetadata } from "../audio/read-audio-metadata.js";
import type { MultipartFile } from "@fastify/multipart";

type TemporarySavedFile = {
  storageKey: string;
  absolutePath: string;
  originalFileName: string;
  mimeType: string;
  sha256: string;
  sizeBytes: bigint;
};

export async function saveTemporaryFile(
  file: MultipartFile,
): Promise<TemporarySavedFile> {
  const tmpDir = getStoragePath();


  await mkdir(tmpDir, { recursive: true });

  const tmpFileName = `${crypto.randomUUID()}.upload`;
  const tmpPath = path.join(tmpDir, tmpFileName);
  const hash = crypto.createHash("sha256");
  let sizeBytes = 0n;
  const collectMetadata = new Transform({
    transform(chunk, encoding, callback) {
      hash.update(chunk);
      sizeBytes += BigInt(chunk.length);
      callback(null, chunk);
    },
  });

  await pipeline(file.file, collectMetadata, createWriteStream(tmpPath));
  const sha256 = hash.digest("hex");
  const extension = getFileExtension(file.filename);
  const storageKey = buildOriginalStorageKey(sha256, extension);
  const finalPath = resolveStoragePath(storageKey);
  await mkdir(path.dirname(finalPath), { recursive: true });
  await rename(tmpPath, finalPath);
  const metadata = await readAudioMetadata(finalPath);
  return {
    storageKey,
    absolutePath: finalPath,
    sha256,
    sizeBytes,
    originalFileName: file.filename,
    mimeType: file.mimetype,
    meta: metadata
  };
}
