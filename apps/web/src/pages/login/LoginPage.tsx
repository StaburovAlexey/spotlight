import { Button, Card, Input } from "@heroui/react";
import { classNames } from "../../shared/lib/classNames";
import styles from "./LoginPage.module.css";
import { useState } from "react";
import { useLogin } from "../../features/auth/hooks/use-login";
import { useNavigate } from "react-router-dom";
export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    set: React.Dispatch<React.SetStateAction<string>>,
  ) {
    set(event.target.value);
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const response = await loginMutation.mutateAsync({
      login,
      password,
    });

    if (!response.success) {
      console.log(response.error);
      return;
    } else {
      navigate("/");
    }

    console.log("Logged in:", response.data);
  }
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
          <form className={styles.form} onSubmit={handleSubmit}>
            <Input
              placeholder="Email или username"
              name="login"
              type="text"
              onChange={($event) => {
                handleChange($event, setLogin);
              }}
              autoComplete="username"
            />

            <Input
              placeholder="Пароль"
              name="password"
              type="password"
              onChange={($event) => {
                handleChange($event, setPassword);
              }}
              autoComplete="current-password"
            />

            <Button variant="primary" type="submit">
              Войти
            </Button>
          </form>
        </Card.Content>
      </Card>
    </main>
  );
}
