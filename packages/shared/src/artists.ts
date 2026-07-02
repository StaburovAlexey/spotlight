import type { ApiResponse } from "./api.js";

export type ArtistDto = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UploadArtistResponse = ApiResponse<ArtistDto>;
