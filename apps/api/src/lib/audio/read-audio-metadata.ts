import { parseFile } from "music-metadata";

export type AudioMetadata = Awaited<ReturnType<typeof readAudioMetadata>>;

export async function readAudioMetadata(filePath: string) {
  const metadata = await parseFile(filePath);

  return {
    title: metadata.common.title ?? null,
    artist: metadata.common.artist ?? null,
    album: metadata.common.album ?? null,
    albumArtist: metadata.common.albumartist ?? null,
    year: metadata.common.year ?? null,
    trackNumber: metadata.common.track.no ?? null,
    discNumber: metadata.common.disk.no ?? null,
    durationSeconds: metadata.format.duration
      ? Math.round(metadata.format.duration)
      : null,
    container: metadata.format.container ?? null,
    codec: metadata.format.codec ?? null,
    bitrate: metadata.format.bitrate ?? null,
  } as const;
}
