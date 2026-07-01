import { createBrowserRouter, type RouteObject } from "react-router-dom";

import { MainLayout } from "../layouts/main-layout/MainLayout";
import { AdminUsersPage } from "../../pages/admin-users/AdminUsersPage";
import { HomePage } from "../../pages/home/HomePage";
import { LibraryPage } from "../../pages/library/LibraryPage";
import { SearchPage } from "../../pages/search/SearchPage";
import { LoginPage } from "../../pages/login/LoginPage";
import { UploadPage } from "../../pages/upload/UploadPage";
import { NotFoundPage } from "../../pages/not-found/NotFoundPage";
import { HelloPage } from "../../pages/hello/HelloPage";
import { SettingsPage } from "../../pages/settings/SettingsPage";
import { SettingsLibraryPage } from "../../pages/settings/SettingsLibraryPage";
import { SettingsUserPage } from "../../pages/settings/SettingsUserPage";

export type AppRouteHandle = {
  routeName?: string;
  back?: boolean;
  to?: string;
};

type AppRouteObject = RouteObject & {
  handle?: AppRouteHandle;
  children?: AppRouteObject[];
};

const routes = [
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        handle: { routeName: "Главная" },
      },

      {
        path: "/library",
        element: <LibraryPage />,
        handle: { routeName: "Медиатека" },
      },
      {
        path: "/search",
        element: <SearchPage />,
        handle: { routeName: "Поиск" },
      },
      {
        path: "/settings",
        children: [
          {
            index: true,
            element: <SettingsPage />,
            handle: { routeName: "Настройки" },
          },
          {
            path: "user",
            element: <SettingsUserPage />,
            handle: { routeName: "Пользователь", back: true, to: "/settings" },
          },
          {
            path: "lib",
            element: <SettingsLibraryPage />,
            handle: { routeName: "Медиатека", back: true, to: "/settings" },
          },
          {
            path: "upload",
            element: <UploadPage />,
            handle: { routeName: "Загрузка", back: true, to: "/settings" },
          },
        ],
      },
    ],
  },
  {
    path: "/hello",
    element: <HelloPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
] satisfies AppRouteObject[];

export const router = createBrowserRouter(routes);
