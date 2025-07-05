import { useContext } from "react";
import { CollapseContext } from "@/context/collapse-context";
import type { CollapseContextType } from "@/types/collapse";

export const useCollapse = (): CollapseContextType => {
  const context = useContext(CollapseContext);
  if (!context)
    throw new Error("useCollapse must be used within an AuthProvider");
  return context;
};
