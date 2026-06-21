import { Card, Chip } from "@heroui/react";
import { Link } from "react-router-dom";

import { classNames } from "../../shared/lib/classNames";
import styles from "./SettingsPage.module.css";

export function SettingsLibraryPage() {
  return (
    <section className={styles.page}>
      <div className={styles.grid}>
        <Card>
          <Card.Header>
            <Card.Title className={classNames(styles.sectionTitle)}>
              Импорт
            </Card.Title>
            <Card.Description className={classNames(styles.sectionDescription)}>
              Настройки источников и сканирования файлов.
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <div>
                  <p className={styles.itemLabel}>Папка импорта</p>
                  <p className={styles.itemText}>Не настроена</p>
                </div>
                <Chip className={classNames(styles.status)} variant="soft">
                  Позже
                </Chip>
              </li>

              <li className={styles.listItem}>
                <div>
                  <p className={styles.itemLabel}>Автосканирование</p>
                  <p className={styles.itemText}>Пока отключено</p>
                </div>
                <Chip className={classNames(styles.status)} variant="soft">
                  Off
                </Chip>
              </li>
            </ul>
          </Card.Content>
        </Card>

        <Card variant="secondary">
          <Card.Header>
            <Card.Title className={classNames(styles.sectionTitle)}>
              Метаданные
            </Card.Title>
            <Card.Description className={classNames(styles.sectionDescription)}>
              Будущая обработка артистов, альбомов и обложек.
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <div>
                  <p className={styles.itemLabel}>Обложки альбомов</p>
                  <p className={styles.itemText}>Будут извлекаться из файлов</p>
                </div>
                <Chip className={classNames(styles.status)} variant="soft">
                  Planned
                </Chip>
              </li>

              <li className={styles.listItem}>
                <div>
                  <p className={styles.itemLabel}>Нормализация названий</p>
                  <p className={styles.itemText}>Пока не применяется</p>
                </div>
                <Chip className={classNames(styles.status)} variant="soft">
                  Off
                </Chip>
              </li>
            </ul>
          </Card.Content>
        </Card>
      </div>
    </section>
  );
}
