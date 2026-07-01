import { useReducer, useCallback, useRef } from "react";
import type { TrackDto } from "@music-app/shared";
import { uploadTrack } from "../api/tracks-api";

export type FileUploadStatus =
  | "pending"
  | "uploading"
  | "success"
  | "error";

export type FileUploadEntry = {
  id: string;
  file: File;
  status: FileUploadStatus;
  progress: number;
  track?: TrackDto;
  error?: string;
};

type Action =
  | { type: "ADD_FILES"; entries: FileUploadEntry[] }
  | { type: "SET_STATUS"; id: string; status: FileUploadStatus }
  | { type: "SET_PROGRESS"; id: string; progress: number }
  | { type: "SET_SUCCESS"; id: string; track: TrackDto }
  | { type: "SET_ERROR"; id: string; error: string }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR_COMPLETED" };

function reducer(
  state: FileUploadEntry[],
  action: Action,
): FileUploadEntry[] {
  switch (action.type) {
    case "ADD_FILES":
      return [...state, ...action.entries];
    case "SET_STATUS":
      return state.map((e) =>
        e.id === action.id ? { ...e, status: action.status } : e,
      );
    case "SET_PROGRESS":
      return state.map((e) =>
        e.id === action.id ? { ...e, progress: action.progress } : e,
      );
    case "SET_SUCCESS":
      return state.map((e) =>
        e.id === action.id
          ? { ...e, status: "success" as const, track: action.track }
          : e,
      );
    case "SET_ERROR":
      return state.map((e) =>
        e.id === action.id
          ? { ...e, status: "error" as const, error: action.error }
          : e,
      );
    case "REMOVE":
      return state.filter((e) => e.id !== action.id);
    case "CLEAR_COMPLETED":
      return state.filter(
        (e) => e.status === "pending" || e.status === "uploading",
      );
  }
}

const CONCURRENCY = 3;

export function useUploadTracks() {
  const [entries, dispatch] = useReducer(reducer, []);
  const activeCount = useRef(0);
  const queue = useRef<Array<{ id: string; file: File }>>([]);

  const drainQueue = useCallback(() => {
    while (activeCount.current < CONCURRENCY && queue.current.length > 0) {
      const item = queue.current.shift()!;
      activeCount.current++;

      dispatch({ type: "SET_STATUS", id: item.id, status: "uploading" });

      uploadTrack(item.file, (percent) => {
        dispatch({ type: "SET_PROGRESS", id: item.id, progress: percent });
      })
        .then((response) => {
          if (response.success) {
            dispatch({
              type: "SET_SUCCESS",
              id: item.id,
              track: response.data,
            });
          } else {
            dispatch({
              type: "SET_ERROR",
              id: item.id,
              error: response.error,
            });
          }
        })
        .catch((err: unknown) => {
          dispatch({
            type: "SET_ERROR",
            id: item.id,
            error:
              err instanceof Error ? err.message : "Upload failed",
          });
        })
        .finally(() => {
          activeCount.current--;
          drainQueue();
        });
    }
  }, []);

  const addFiles = useCallback(
    (files: File[]) => {
      const newEntries: FileUploadEntry[] = files.map((file) => ({
        id: crypto.randomUUID(),
        file,
        status: "pending" as const,
        progress: 0,
      }));

      dispatch({ type: "ADD_FILES", entries: newEntries });

      for (const entry of newEntries) {
        queue.current.push({ id: entry.id, file: entry.file });
      }

      drainQueue();
    },
    [drainQueue],
  );

  const removeEntry = useCallback((id: string) => {
    queue.current = queue.current.filter((q) => q.id !== id);
    dispatch({ type: "REMOVE", id });
  }, []);

  const clearCompleted = useCallback(() => {
    dispatch({ type: "CLEAR_COMPLETED" });
  }, []);

  const isUploading =
    entries.some(
      (e) => e.status === "pending" || e.status === "uploading",
    );

  return {
    entries,
    addFiles,
    removeEntry,
    clearCompleted,
    isUploading,
  };
}
