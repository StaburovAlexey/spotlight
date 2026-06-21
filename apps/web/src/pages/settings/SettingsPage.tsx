import { Card, Chip } from "@heroui/react";
import { ChevronRight, Library, User } from "lucide-react";
import { Link } from "react-router-dom";

import { classNames } from "../../shared/lib/classNames";
import styles from "./SettingsPage.module.css";
import { SettingsHeaderPage } from "./SettingsHeaderPage";

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
];

export function SettingsPage() {
  return (
    <section className={styles.page}>
      <SettingsHeaderPage
        name="Настройки"
        title="Разделы настроек"
        discription="Выбери группу, чтобы открыть отдельную страницу параметров."
        viewBack={false}
      />

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
