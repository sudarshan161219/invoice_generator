import { createContext } from "react";

import type { CollapseContextType } from "@/types/collapse";

export const CollapseContext = createContext<CollapseContextType>({
  collapse: false,
  toggleSidebar: () => {},
  setCollapse: () => {},
});
