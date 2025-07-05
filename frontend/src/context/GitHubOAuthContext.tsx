import { createContext } from "react";
import type { GitHubOAuthContextType } from "@/types/gitHubOAuthContextType";

// export const AuthContext = createContext<AuthContextType | null>(null);
export const GitHubOAuthContext = createContext<
  GitHubOAuthContextType | undefined
>(undefined);
