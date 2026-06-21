import { Card, Chip } from "@heroui/react";
import { Disc3, Mic2 } from "lucide-react";

import { classNames } from "../../shared/lib/classNames";
import styles from "./HomePage.module.css";

const recentlyUploaded = [
  {
    title: "Midnight Signals",
    subtitle: "Nova Arc",
    meta: "Альбом",
    tone: "green",
  },
  {
    title: "Low Light",
    subtitle: "Echo Room",
    meta: "Трек",
    tone: "violet",
  },
  {
    title: "Static Bloom",
    subtitle: "Mira Vale",
    meta: "EP",
    tone: "blue",
  },
  {
    title: "Northbound",
    subtitle: "The Current",
    meta: "Альбом",
    tone: "amber",
  },
];

const recentlyPlayed = [
  {
    title: "Afterimage",
    subtitle: "Lumen Field",
    meta: "Сегодня",
    tone: "blue",
  },
  {
    title: "Soft Machines",
    subtitle: "Kite Valley",
    meta: "Вчера",
    tone: "green",
  },
  {
    title: "Glass Avenue",
    subtitle: "Noon State",
    meta: "3 дня назад",
    tone: "amber",
  },
  {
    title: "Parallel Lines",
    subtitle: "Arden",
    meta: "На неделе",
    tone: "violet",
  },
];

export function HomePage() {
  return (
    <section className={styles.page}>
      <section className={styles.shelf} aria-labelledby="recently-uploaded">
        <div className={styles.shelfHeader}>
          <div>
            <p className={styles.eyebrow}>Новые файлы</p>
            <h2 className={styles.sectionTitle} id="recently-uploaded">
              Недавно загруженные
            </h2>
          </div>
          <Disc3 className={styles.sectionIcon} size={22} />
        </div>

        <div className={styles.scroller}>
          {recentlyUploaded.map((item) => (
            <Card key={item.title} className={classNames(styles.mediaCard)}>
              <Card.Content>
                <div className={classNames(styles.cover, styles[item.tone])} />
                <div className={styles.mediaInfo}>
                  <h3 className={styles.mediaTitle}>{item.title}</h3>
                  <p className={styles.mediaSubtitle}>{item.subtitle}</p>
                  <p className={styles.mediaMeta}>{item.meta}</p>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>

      <section className={styles.shelf} aria-labelledby="recently-played">
        <div className={styles.shelfHeader}>
          <div>
            <p className={styles.eyebrow}>История</p>
            <h2 className={styles.sectionTitle} id="recently-played">
              Недавно прослушанные
            </h2>
          </div>
          <Mic2 className={styles.sectionIcon} size={22} />
        </div>

        <div className={styles.scroller}>
          {recentlyPlayed.map((item) => (
            <Card key={item.title} className={classNames(styles.mediaCard)}>
              <Card.Content>
                <div className={classNames(styles.cover, styles[item.tone])} />
                <div className={styles.mediaInfo}>
                  <h3 className={styles.mediaTitle}>{item.title}</h3>
                  <p className={styles.mediaSubtitle}>{item.subtitle}</p>
                  <p className={styles.mediaMeta}>{item.meta}</p>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      </section>
    </section>
  );
}
