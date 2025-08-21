import type { FC, ReactElement } from "react";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Bell, UserCog } from "lucide-react";
import styles from "./index.module.css";

export const QuickActions: FC = (): ReactElement | null => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.container}>
      <div className={styles.notification}>
        <Bell className={styles.bellIcon} size={19} />
        <span className={styles.notificationBubble}></span>
      </div>

      <UserCog className={styles.bellIcon} size={19} />

      <div className={styles.themeToggleContainer}>
        {theme === "dark" ? (
          <Sun size={19} className={styles.themeIcon} onClick={toggleTheme} />
        ) : (
          <Moon size={19} className={styles.themeIcon} onClick={toggleTheme} />
        )}
      </div>
    </div>
  );
};
