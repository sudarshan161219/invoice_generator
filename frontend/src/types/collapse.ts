export type Collapse = boolean;
export interface CollapseContextType {
  collapse: Collapse;
  toggleSidebar: () => void;
  setCollapse: (collapse: Collapse) => void;
}
