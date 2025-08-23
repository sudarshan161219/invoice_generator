import { useState, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import styles from "./index.module.css";

const STORAGE_KEY = "activeTab";

export interface Tab {
  id: number;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTabId?: number;
  variant?: "default" | "outline";
  renderWrapper?: (children: ReactNode) => ReactNode;
  onTabChange?: (tabId: number) => void;
  persistPath?: string;
}

export const Tabs = ({
  tabs,
  defaultTabId,
  variant = "default",
  renderWrapper,
  onTabChange,
}: TabsProps) => {
  const location = useLocation();

  // Only persist if on /settings
  const [activeTab, setActiveTab] = useState<number>(() => {
    if (location.pathname === "/settings") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? Number(saved) : defaultTabId || tabs[0].id;
    }
    return defaultTabId || tabs[0].id;
  });

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  // Save active tab if in /settings
  useEffect(() => {
    if (location.pathname === "/settings") {
      localStorage.setItem(STORAGE_KEY, String(activeTab));
    }
  }, [activeTab, location.pathname]);

  // Clear persistence when leaving /settings
  useEffect(() => {
    if (location.pathname !== "/settings") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [location.pathname]);

  const wrapperClassName = styles[variant] || styles.default;

  const DefaultWrapper = (children: ReactNode) => (
    <div className={wrapperClassName}>{children}</div>
  );

  const tabOnchange = (tabId: number) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  return (
    <div
      className={`w-full border-[var(--foreground)] border-solid ${styles.tabsContainer}`}
    >
      {/* Tab Headers */}
      <div className={styles.TabHeaders}>
        {tabs.map((tab) => {
          const isTabActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => tabOnchange(tab.id)}
              style={
                isTabActive
                  ? {
                      borderBottom: "2px solid var(--primary)",
                      color: "var(--primary)",
                    }
                  : {}
              }
              className={` mb-2
                ${variant === "default" ? styles.default : styles.outline}
                transition-colors duration-200 ${styles.button}
              `}
            >
              <div
                style={
                  isTabActive
                    ? {
                        color: "var(--primary)",
                      }
                    : {}
                }
                className={styles.tabs}
              >
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
