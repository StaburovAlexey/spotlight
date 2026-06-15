import { Link } from "react-router-dom";

import styles from "./NotFoundPage.module.css";

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <div className={styles.content}>
        <p className={styles.code}>404</p>

        <h1 className={styles.title}>Страница не найдена</h1>

        <p className={styles.description}>
          Такой страницы нет или она была перемещена.
        </p>

        <Link to="/" className={styles.homeLink ?? ""}>
          На главную
        </Link>
      </div>
    </main>
  );
}
