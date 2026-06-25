import { createWriteStream } from "node:fs";
import { Transform } from "node:stream";
import { mkdir, rename, access } from "node:fs/promises";
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
import type { AudioMetadata } from "../audio/read-audio-metadata.js";

export type TemporarySavedFile = {
  storageKey: string;
  absolutePath: string;
  originalFileName: string;
  mimeType: string;
  sha256: string;
  sizeBytes: bigint;
  meta: AudioMetadata;
  tmpPath: string;
};

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function commitUploadedFileToPath(
  file: TemporarySavedFile,
  targetPath: string,
): Promise<void> {
  await mkdir(path.dirname(targetPath), { recursive: true });
  await rename(file.tmpPath, targetPath);
}
export async function commitUploadedFile(
  file: TemporarySavedFile,
): Promise<void> {
  await mkdir(path.dirname(file.absolutePath), { recursive: true });
  await rename(file.tmpPath, file.absolutePath);
}

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
  const metadata = await readAudioMetadata(tmpPath);
  return {
    tmpPath,
    storageKey,
    absolutePath: finalPath,
    sha256,
    sizeBytes,
    originalFileName: file.filename,
    mimeType: file.mimetype,
    meta: metadata,
  };
}
