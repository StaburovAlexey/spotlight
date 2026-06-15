import { Button, Card, Chip } from "@heroui/react";
import { classNames } from "../../shared/lib/classNames";
import styles from "./HomePage.module.css";

export function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Chip variant="primary">Self-hosted music app</Chip>

        <h1 className={styles.title}>Твоя музыкальная библиотека</h1>

        <p className={styles.description}>
          Загружай треки и альбомы, слушай музыку в браузере и собирай свои
          плейлисты.
        </p>

        <div className={styles.actions}>
          <Button variant="secondary">Открыть библиотеку</Button>

          <Button variant="secondary">Загрузить музыку</Button>
        </div>
      </section>

      <section className={styles.grid}>
        <Card variant="secondary">
          <Card.Header>
            <Card.Title className={classNames(styles.cardTitle)}>
              Библиотека
            </Card.Title>
          </Card.Header>

          <Card.Content>
            <p className={styles.cardText}>
              Общий каталог треков, альбомов и исполнителей для всех
              пользователей.
            </p>
          </Card.Content>
        </Card>

        <Card variant="default">
          <Card.Header>
            <Card.Title className={classNames(styles.cardTitle)}>
              Плейлисты
            </Card.Title>
          </Card.Header>

          <Card.Content>
            <p className={styles.cardText}>
              Каждый пользователь сможет создавать и сохранять собственные
              плейлисты.
            </p>
          </Card.Content>
        </Card>

        <Card variant="transparent">
          <Card.Header>
            <Card.Title className={classNames(styles.cardTitle)}>
              Админка
            </Card.Title>
          </Card.Header>

          <Card.Content>
            <p className={styles.cardText}>
              Пользователей создает админ. Публичной регистрации в приложении не
              будет.
            </p>
          </Card.Content>
        </Card>
      </section>
    </main>
  );
}
