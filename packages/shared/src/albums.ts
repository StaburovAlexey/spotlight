import type { ApiResponse } from "./api.js";

export type AlbumWithArtistDto = {
  id: string;
  title: string;
  titleNormalized: string;
  artistId: string | null;
  artistName: string | null;
  uploadedById: string | null;
  createdAt: string;
};

export type UploadAlbumResponse = ApiResponse<AlbumWithArtistDto>;
