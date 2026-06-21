import { Card, Chip } from "@heroui/react";
import {
  AudioLines,
  Disc3,
  Library,
  Mic2,
  Radio,
  Search,
  Sparkles,
  Tags,
} from "lucide-react";

import { classNames } from "../../shared/lib/classNames";
import styles from "./SearchPage.module.css";

const categories = [
  {
    title: "Альбомы",
    description: "Полные релизы и сборники",
    icon: Disc3,
    count: "0",
    tone: "green",
  },
  {
    title: "Артисты",
    description: "Исполнители в медиатеке",
    icon: Mic2,
    count: "0",
    tone: "blue",
  },
  {
    title: "Треки",
    description: "Все загруженные композиции",
    icon: AudioLines,
    count: "0",
    tone: "violet",
  },
  {
    title: "Жанры",
    description: "Навигация по стилям",
    icon: Tags,
    count: "0",
    tone: "amber",
  },
];

const collections = [
  {
    title: "Для вечернего прослушивания",
    description: "Спокойные альбомы и мягкие треки",
    icon: Sparkles,
  },
  {
    title: "Недавно добавленное",
    description: "Быстрый срез новых файлов в библиотеке",
    icon: Library,
  },
  {
    title: "Радио по настроению",
    description: "Будущие автоподборки по истории прослушивания",
    icon: Radio,
  },
];

export function SearchPage() {
  return (
    <section className={styles.page}>
      <section className={styles.searchPanel} aria-label="Поиск по медиатеке">
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} size={20} />
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Поиск по трекам, альбомам и артистам"
          />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="search-categories">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Каталог</p>
            <h2 className={styles.sectionTitle} id="search-categories">
              Категории
            </h2>
          </div>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Card key={category.title}>
                <Card.Content>
                  <button className={styles.categoryCard}>
                    <span
                      className={classNames(
                        styles.categoryIcon,
                        styles[category.tone],
                      )}
                    >
                      <Icon size={22} />
                    </span>

                    <span className={styles.categoryBody}>
                      <span className={styles.categoryTitle}>
                        {category.title}
                      </span>
                      <span className={styles.categoryDescription}>
                        {category.description}
                      </span>
                    </span>

                    <Chip variant="soft">{category.count}</Chip>
                  </button>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="search-collections">
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.eyebrow}>Подборки</p>
            <h2 className={styles.sectionTitle} id="search-collections">
              Другие подборки
            </h2>
          </div>
        </div>

        <div className={styles.collectionList}>
          {collections.map((collection) => {
            const Icon = collection.icon;

            return (
              <Card key={collection.title} variant="secondary">
                <Card.Content>
                  <div className={styles.collectionItem}>
                    <span className={styles.collectionIcon}>
                      <Icon size={20} />
                    </span>
                    <div>
                      <h3 className={styles.collectionTitle}>
                        {collection.title}
                      </h3>
                      <p className={styles.collectionDescription}>
                        {collection.description}
                      </p>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            );
          })}
        </div>
      </section>
    </section>
  );
}
