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
