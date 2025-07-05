import { useEffect, useState, type ReactNode } from "react";
import { CollapseContext } from "@/context/collapse-context";
import type { CollapseContextType } from "@/types/collapse";

const STORAGE_KEY = "sidebar-collapsed";

export const CollapseProvider = ({ children }: { children: ReactNode }) => {
  const [collapse, setCollapse] = useState<boolean>(() => {
    const storedValue = localStorage.getItem("sidebar-collapsed");
    return storedValue === "true"; // defaults to false if null
  });

  useEffect(() => {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    if (storedValue !== null) {
      setCollapse(storedValue === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapse));
  }, [collapse]);

  const toggleSidebar = () => {
    setCollapse((prev) => !prev);
  };

  const contextValue: CollapseContextType = {
    collapse,
    toggleSidebar,
    setCollapse,
  };

  return (
    <CollapseContext.Provider value={contextValue}>
      {children}
    </CollapseContext.Provider>
  );
};
