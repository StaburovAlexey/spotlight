import { NavLink, Outlet } from "react-router-dom";
import { Home, Library, Settings } from "lucide-react";

import styles from "./MainLayout.module.css";

const navItems = [
  {
    to: "/",
    label: "Главная",
    icon: Home,
  },
  {
    to: "/library",
    label: "Библиотека",
    icon: Library,
  },
  {
    to: "/admin/users",
    label: "Админка",
    icon: Settings,
  },
];

export function MainLayout() {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar} aria-label="Основная навигация">
        <div className={styles.sidebarTitle}>Music App</div>

        <nav className={styles.sidebarNav}>
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.sidebarLink} ${styles.sidebarLinkActive}`
                    : styles.sidebarLink
                }
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className={styles.main}>
        <Outlet />
      </main>
        
      <nav className={styles.bottomNav} aria-label="Мобильная навигация">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? `${styles.bottomNavLink} ${styles.bottomNavLinkActive}`
                  : styles.bottomNavLink
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
