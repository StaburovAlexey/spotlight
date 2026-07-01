import {
  useState,
  useRef,
  useCallback,
  type DragEvent,
  type ChangeEvent,
} from "react";
import { Upload, Music, X, Loader } from "lucide-react";
import { Alert } from "@heroui/react";

import { useUploadTracks } from "../../features/tracks/hooks/use-upload-tracks";
import styles from "./UploadPage.module.css";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const AUDIO_EXTENSIONS = [
  ".mp3",
  ".flac",
  ".wav",
  ".ogg",
  ".aac",
  ".wma",
  ".m4a",
  ".opus",
];

function filterAudioFiles(files: FileList | File[]): File[] {
  return Array.from(files).filter((f) => {
    const ext = f.name.slice(f.name.lastIndexOf(".")).toLowerCase();
    return AUDIO_EXTENSIONS.includes(ext);
  });
}

export function UploadPage() {
  const { entries, addFiles, removeEntry, clearCompleted, isUploading } =
    useUploadTracks();

  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const audioFiles = filterAudioFiles(files);
      if (audioFiles.length > 0) {
        addFiles(audioFiles);
      }
    },
    [addFiles],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
        e.target.value = "";
      }
    },
    [handleFiles],
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const successCount = entries.filter((e) => e.status === "success").length;
  const errorCount = entries.filter((e) => e.status === "error").length;
  const pendingCount = entries.filter(
    (e) => e.status === "pending" || e.status === "uploading",
  ).length;

  return (
    <section className={styles.page}>
      <div
        className={
          isDragOver
            ? `${styles.dropZone} ${styles.dropZoneActive}`
            : styles.dropZone
        }
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleClick();
        }}
      >
        <Upload size={36} className={styles.dropZoneIcon} />
        <p className={styles.dropZoneText}>
          Перетащите аудиофайлы сюда или нажмите, чтобы выбрать
        </p>
        <p className={styles.dropZoneHint}>
          MP3, FLAC, WAV, OGG, AAC, WMA, M4A, OPUS
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        className={styles.hiddenInput}
        onChange={handleInputChange}
      />

      {entries.length > 0 && (
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <span>
              {entries.length}{" "}
              {entries.length === 1 ? "файл" : "файлов"}
            </span>
            {successCount > 0 && (
              <span className={styles.entryMetaSuccess}>
                · {successCount} загружено
              </span>
            )}
            {errorCount > 0 && (
              <span className={styles.entryMetaError}>
                · {errorCount} ошибок
              </span>
            )}
            {pendingCount > 0 && (
              <span>· {pendingCount} в очереди</span>
            )}
          </div>

          {successCount + errorCount > 0 && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={clearCompleted}
            >
              Очистить завершённые
            </button>
          )}
        </div>
      )}

      {entries.length > 0 ? (
        <div className={styles.list}>
          {entries.map((entry) => (
            <UploadAlert
              key={entry.id}
              entry={entry}
              onRemove={removeEntry}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <Music size={32} />
          <span>Нет файлов в очереди</span>
        </div>
      )}
    </section>
  );
}

type UploadAlertProps = {
  entry: ReturnType<typeof useUploadTracks>["entries"][number];
  onRemove: (id: string) => void;
};

function alertStatus(
  s: string,
): "default" | "success" | "danger" | "warning" {
  if (s === "success") return "success";
  if (s === "error") return "danger";
  if (s === "uploading") return "warning";
  return "default";
}

function UploadAlert({ entry, onRemove }: UploadAlertProps) {
  const sizeText = formatSize(entry.file.size);

  return (
    <Alert status={alertStatus(entry.status)}>
      <Alert.Indicator>
        <AlertIndicator status={entry.status} />
      </Alert.Indicator>

      <Alert.Content>
        <Alert.Title>
          {entry.track?.title ?? entry.file.name}
        </Alert.Title>

        <Alert.Description>
          {entry.status === "pending" && (
            <span>{sizeText} · ожидает загрузки</span>
          )}
          {entry.status === "uploading" && (
            <span>
              {sizeText} · {entry.progress}%
            </span>
          )}
          {entry.status === "success" && entry.track && (
            <span>
              Загружен · {formatDuration(entry.track.durationSeconds)}{" "}
              · {sizeText}
            </span>
          )}
          {entry.status === "error" && (
            <span>{entry.error ?? "Ошибка загрузки"}</span>
          )}
        </Alert.Description>
      </Alert.Content>

      {entry.status !== "uploading" && (
        <button
          type="button"
          className={styles.alertRemove}
          onClick={() => onRemove(entry.id)}
          aria-label="Удалить"
        >
          <X size={14} />
        </button>
      )}
    </Alert>
  );
}

function AlertIndicator({ status }: { status: string }) {
  switch (status) {
    case "uploading":
      return <Loader size={18} className={styles.spin} />;
    default:
      return null;
  }
}
