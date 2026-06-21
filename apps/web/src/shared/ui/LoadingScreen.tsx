import styles from "./LoadingScreen.module.css";

type LoadingScreenProps = {
  label?: string;
};

export function LoadingScreen({ label = "Загрузка" }: LoadingScreenProps) {
  return (
    <main className={styles.screen} aria-busy="true" aria-live="polite">
      <div className={styles.content}>
        <span className={styles.spinner} aria-hidden="true" />
        <p className={styles.text}>{label}</p>
      </div>
    </main>
  );
}
