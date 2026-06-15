import { Button, Card } from "@heroui/react";

import styles from "./AdminUsersPage.module.css";

export function AdminUsersPage() {
  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Админка</p>
          <h1 className={styles.title}>Пользователи</h1>
          <p className={styles.description}>
            Позже здесь будет создание пользователей, сброс паролей и управление
            доступом.
          </p>
        </div>

        <Button variant="primary">Создать пользователя</Button>
      </header>

      <Card>
        <Card.Content>
          <div className={styles.emptyState}>
            <h2 className={styles.emptyTitle}>Пока нет данных</h2>
            <p className={styles.emptyDescription}>
              На следующих этапах подключим backend и выведем пользователей из
              PostgreSQL.
            </p>
          </div>
        </Card.Content>
      </Card>
    </section>
  );
}
