import { Card, Chip } from "@heroui/react";
import { ChevronRight, Library, Upload, User } from "lucide-react";
import { Link } from "react-router-dom";

import { classNames } from "../../shared/lib/classNames";
import styles from "./SettingsPage.module.css";


const settingsGroups = [
  {
    to: "/settings/user",
    title: "Пользователь",
    description: "Профиль, роль, статус аккаунта и параметры сессии.",
    icon: User,
    status: "Аккаунт",
  },
  {
    to: "/settings/lib",
    title: "Библиотека",
    description: "Импорт музыки, сканирование и будущие настройки каталога.",
    icon: Library,
    status: "Музыка",
  },
  {
    to: "/settings/upload",
    title: "Загрузка треков",
    description: "Загрузите аудиофайлы в медиатеку. Поддержка MP3, FLAC, WAV и других форматов.",
    icon: Upload,
    status: "Импорт",
  },
];

export function SettingsPage() {
  return (
    <section className={styles.page}>
      <div className={styles.groupGrid}>
        {settingsGroups.map((group) => {
          const Icon = group.icon;

          return (
            <Link key={group.to} className={styles.groupLink} to={group.to}>
              <Card>
                <Card.Content>
                  <div className={styles.groupCard}>
                    <span className={styles.groupIcon}>
                      <Icon size={22} />
                    </span>

                    <div className={styles.groupBody}>
                      <div className={styles.groupHeader}>
                        <h2 className={styles.groupTitle}>{group.title}</h2>
                        <Chip variant="soft">{group.status}</Chip>
                      </div>
                      <p className={styles.groupDescription}>
                        {group.description}
                      </p>
                    </div>

                    <ChevronRight className={styles.groupArrow} size={20} />
                  </div>
                </Card.Content>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
