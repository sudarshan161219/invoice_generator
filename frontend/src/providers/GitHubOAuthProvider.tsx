import { useState, useContext, useEffect, type ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import type { GitHubOAuthContextType } from "@/types/gitHubOAuthContextType";
import { GitHubOAuthContext } from "@/context/GitHubOAuthContext";
import { githubOAuth } from "@/modules/auth/api/auth.api";

export function GitHubOAuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const mode = url.searchParams.get("state") as "login" | "register";

    if (!code || !mode) return;

    (async () => {
      try {
        setIsLoading(true);
        const { token, success } = await githubOAuth(code, mode);

        if (success) {
          setIsLoading(false);
          setToken(token);
          toast.success("Logged in with GitHub");
          navigate("/");
        }
      } catch (err: any) {
        const msg = err.response?.data?.message || "GitHub login failed";
        setIsLoading(false);
        toast.error(msg);
        navigate("/auth");
      }
    })();
  }, [location.pathname, navigate]);

  const values: GitHubOAuthContextType = {
    isLoading,
    token,
  };

  return (
    <GitHubOAuthContext.Provider value={values}>
      {children}
    </GitHubOAuthContext.Provider>
  );
}

// optional future usage
export const useGitHubOAuth = () => useContext(GitHubOAuthContext);
