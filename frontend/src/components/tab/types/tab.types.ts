import { type ReactNode } from "react";

export type Tab = {
  id: number;
  label: string;
  themeColor?: string;
  content: ReactNode;
  icon?: ReactNode;
  toggleLight?: () => void;
  toggleDark?: () => void;
};

export interface TabsProps {
  tabs: Tab[];
  defaultTabId?: number;
  mode?: string;
  variant?: "default" | "outline";
  toggleTheme?: () => void;
  renderWrapper?: (children: ReactNode) => ReactNode;
  onTabChange?: (tabId: number) => void;
}
