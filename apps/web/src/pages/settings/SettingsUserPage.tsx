import { Button, Card, Chip } from "@heroui/react";

import { useCurrentUser } from "../../features/auth/hooks/use-current-user";
import { classNames } from "../../shared/lib/classNames";
import styles from "./SettingsPage.module.css";
import { SettingsHeaderPage } from "./SettingsHeaderPage";

export function SettingsUserPage() {
  const { data: user } = useCurrentUser();

  return (
    <section className={styles.page}>
      <SettingsHeaderPage name="Пользователь" title='Аккаунт и сессия' discription="Данные текущего пользователя берутся из активной сессии." />

      <div className={styles.grid}>
        <Card>
          <Card.Header>
            <Card.Title className={classNames(styles.sectionTitle)}>
              Профиль
            </Card.Title>
            <Card.Description className={classNames(styles.sectionDescription)}>
              Основные данные аккаунта.
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <div className={styles.form}>
              <div className={styles.fieldGrid}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Email</span>
                  <span className={styles.fieldValue}>{user?.email ?? ""}</span>
                </div>

                <div className={styles.field}>
                  <span className={styles.fieldLabel}>Username</span>
                  <span className={styles.fieldValue}>
                    {user?.username ?? ""}
                  </span>
                </div>
              </div>

              <div className={styles.field}>
                <span className={styles.fieldLabel}>Отображаемое имя</span>
                <span className={styles.fieldValue}>
                  {user?.displayName ?? ""}
                </span>
              </div>

              <div className={styles.actions}>
                <Button variant="secondary" isDisabled>
                  Сохранить
                </Button>
              </div>
            </div>
          </Card.Content>
        </Card>

        <Card variant="secondary">
          <Card.Header>
            <Card.Title className={classNames(styles.sectionTitle)}>
              Сессия
            </Card.Title>
            <Card.Description className={classNames(styles.sectionDescription)}>
              Текущий доступ и состояние профиля.
            </Card.Description>
          </Card.Header>

          <Card.Content>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <div>
                  <p className={styles.itemLabel}>Роль</p>
                  <p className={styles.itemText}>Уровень доступа в системе</p>
                </div>
                <Chip className={classNames(styles.status)} variant="primary">
                  {user?.role ?? "unknown"}
                </Chip>
              </li>

              <li className={styles.listItem}>
                <div>
                  <p className={styles.itemLabel}>Статус</p>
                  <p className={styles.itemText}>Состояние аккаунта</p>
                </div>
                <Chip className={classNames(styles.status)} variant="secondary">
                  {user?.status ?? "unknown"}
                </Chip>
              </li>

              <li className={styles.listItem}>
                <div>
                  <p className={styles.itemLabel}>Смена пароля</p>
                  <p className={styles.itemText}>
                    Требуется ли обновить пароль при входе
                  </p>
                </div>
                <Chip className={classNames(styles.status)} variant="soft">
                  {user?.mustChangePassword ? "Да" : "Нет"}
                </Chip>
              </li>
            </ul>
          </Card.Content>
        </Card>
      </div>
    </section>
  );
}
