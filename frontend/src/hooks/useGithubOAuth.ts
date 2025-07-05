import { useContext } from "react";
import { GitHubOAuthContext } from "@/context/GitHubOAuthContext";
import type { GitHubOAuthContextType } from "@/types/gitHubOAuthContextType";

export const useGitHubOAuth = (): GitHubOAuthContextType => {
  const context = useContext(GitHubOAuthContext);
  if (!context)
    throw new Error("useGitHubOAut must be used within an GoogleAuthProvider");
  return context;
};
