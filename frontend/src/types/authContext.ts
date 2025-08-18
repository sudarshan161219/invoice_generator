import type { User } from "./user";

export interface AuthContextType {
  user: User | null;
  userId: number | undefined;
  loading: boolean;
  login: () => void;
  logout: () => void;
}
