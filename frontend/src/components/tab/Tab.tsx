import { useState, type ReactNode } from "react";
import styles from "./index.module.css";
import { useTheme } from "@/hooks/useTheme";
import type { TabsProps } from "./types/tab.types";

export const Tabs = ({
  tabs,
  defaultTabId,
  variant = "default",
  mode,
  renderWrapper,
  onTabChange,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTabId || tabs[0].id);
  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;
  const { theme, toggleLight, toggleDark } = useTheme();

  // Dynamically choose wrapper style
  const wrapperClassName = styles[variant] || styles.default;

  const DefaultWrapper = (children: ReactNode) => (
    <div className={wrapperClassName}>{children}</div>
  );

  const tabOnchange = (tabId: number) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);

    if (mode === "theme") {
      if (tabId === 1) {
        toggleLight();
      } else {
        toggleDark();
      }
    }
  };

  return (
    <div
      className={`w-full border-[var(--foreground)] border-solid ${styles.tabsContainer}`}
    >
      {/* Tab Headers */}
      <div className="flex">
        {tabs.map((tab) => {
          const isThemeMode = mode === "theme";
          const isThemeActive = theme === tab.themeColor;
          const isTabActive = activeTab === tab.id;
          const isActive = isThemeMode ? isThemeActive : isTabActive;

          return (
            <button
              key={tab.id}
              onClick={() => tabOnchange(tab.id)}
              style={isActive ? { backgroundColor: "var(--tabTheme)" } : {}}
              className={` mb-2
        ${variant === "default" ? styles.default : styles.outline}
        transition-colors duration-200
      `}
            >
              <div className={styles.tabs}>
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {activeTabContent &&
        (renderWrapper
          ? renderWrapper(activeTabContent)
          : DefaultWrapper(activeTabContent))}
    </div>
  );
};
