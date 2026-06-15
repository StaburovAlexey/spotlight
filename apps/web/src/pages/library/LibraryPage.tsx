import { Card } from "@heroui/react";

import styles from "./LibraryPage.module.css";

const mockAlbums = [
  "Recently Added",
  "Favorite Tracks",
  "Rock Collection",
  "Electronic Mix",
];

export function LibraryPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Библиотека</p>
        <h1 className={styles.title}>Музыка</h1>
        <p className={styles.description}>
          Здесь позже появятся загруженные треки, альбомы и исполнители.
        </p>
      </header>

      <div className={styles.grid}>
        {mockAlbums.map((album) => (
          <Card key={album}>
            <Card.Content>
              <div className={styles.albumCover} />
              <h2 className={styles.albumTitle}>{album}</h2>
              <p className={styles.albumDescription}>Плейсхолдер раздела</p>
            </Card.Content>
          </Card>
        ))}
      </div>
    </section>
  );
}
