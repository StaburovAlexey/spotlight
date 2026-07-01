import type { ApiResponse, TrackDto } from "@music-app/shared";

export function uploadTrack(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<ApiResponse<TrackDto>> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener("load", () => {
      try {
        const json = JSON.parse(xhr.responseText) as ApiResponse<TrackDto>;
        resolve(json);
      } catch {
        reject(new Error("Invalid response from server"));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.addEventListener("abort", () => {
      reject(new Error("Upload aborted"));
    });

    xhr.open("POST", "/api/tracks/upload");
    xhr.withCredentials = true;
    xhr.send(formData);
  });
}

export async function getTracks(): Promise<ApiResponse<TrackDto[]>> {
  const response = await fetch("/api/tracks", {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.json() as Promise<ApiResponse<TrackDto[]>>;
}
