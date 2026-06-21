import styles from "./SettingsHeaderPage.module.css";
import { Link } from "react-router-dom";

interface SettingsHeaderPageProps {
  title: string;
  name: string;
  discription: string;
  viewBack?: boolean;
}

export function SettingsHeaderPage({
  name,
  title,
  discription,
  viewBack = true,
}: SettingsHeaderPageProps) {
  return (
    <header className={styles.header}>
      <div className={styles.nameBtn}>
        <p className={styles.eyebrow}>{name}</p>
        {viewBack && (
          <Link className={styles.backLink} to="/settings">
            НАЗАД
          </Link>
        )}
      </div>

      <h1 className={styles.title}>{title}</h1>
      <p className={styles.description}>{discription}</p>
    </header>
  );
}
