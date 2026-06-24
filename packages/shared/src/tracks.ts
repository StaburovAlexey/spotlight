
import type { ApiResponse } from "./api.js";

export type TrackStatus = "PROCESSING" | "READY" | "FAILED";

export type TrackDto = {
  id: string;
  title: string;
  durationSeconds: number | null;
  trackNumber: number | null;
  discNumber: number;
  storageKey: string;
  originalFileName: string;
  mimeType: string;
  sizeBytes: string;
  sha256: string;
  status: TrackStatus;
  artistId: string | null;
  albumId: string | null;
  uploadedById: string | null;
  createdAt: string;
};

export type UploadTrackResponse = ApiResponse<TrackDto>;
