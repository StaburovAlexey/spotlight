import { createBrowserRouter } from "react-router-dom";

import { MainLayout } from "../layouts/main-layout/MainLayout";
import { AdminUsersPage } from "../../pages/admin-users/AdminUsersPage";
import { HomePage } from "../../pages/home/HomePage";
import { LibraryPage } from "../../pages/library/LibraryPage";
import { LoginPage } from "../../pages/login/LoginPage";
import { NotFoundPage } from "../../pages/not-found/NotFoundPage";
import { HelloPage } from "../../pages/hello/HelloPage";
export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/library",
        element: <LibraryPage />,
      },
      {
        path: "/admin/users",
        element: <AdminUsersPage />,
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
]);
