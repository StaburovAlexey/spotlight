import { Button, Card, Input } from '@heroui/react'
import { classNames } from '../../shared/lib/classNames'
import styles from './LoginPage.module.css'

export function LoginPage() {
  return (
    <main className={styles.page}>
      <Card className={classNames(styles.card)}>
        <Card.Header>
          <Card.Title>Вход</Card.Title>
          <Card.Description>
            Пользователей создает администратор. Публичной регистрации не будет.
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <form className={styles.form}>
            <Input
              placeholder="Email или username"
              name="login"
              type="text"
              autoComplete="username"
            />

            <Input
              placeholder="Пароль"
              name="password"
              type="password"
              autoComplete="current-password"
            />

            <Button variant="primary" type="submit">
              Войти
            </Button>
          </form>
        </Card.Content>
      </Card>
    </main>
  )
}