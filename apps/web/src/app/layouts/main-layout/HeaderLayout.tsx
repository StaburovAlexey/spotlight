import styles from "./HeaderLayout.module.css";
import { Link } from "react-router-dom";
import { useRouteMeta } from "../../../features/auth/hooks/use-route-meta";

export function HeaderLayout() {
  const { to, routeName, back } = useRouteMeta();

  return (
    <header className={styles.header}>
      <div className={styles.nameBtn}>
        <p className={styles.eyebrow}>{routeName}</p>
        {back && to && (
          <Link className={styles.backLink} to={to}>
            НАЗАД
          </Link>
        )}
      </div>
    </header>
  );
}
