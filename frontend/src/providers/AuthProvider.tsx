import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../context/auth-context";
import type { User } from "@/types/user";
import type { AuthContextType } from "@/types/authContext";
import { getUser } from "@/modules/auth/api/auth.api";

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<number | undefined>()
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res.data);
        setUserId(res.data.id);
      } catch (err) {
        console.log(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async () => {
    try {
      const res = await getUser();
      setUser(res);
    } catch (err) {
      console.error("Login refetch error:", err);
      setUser(null);
    }
  };

  const logout = () => {
    // Optional: Call logout endpoint to clear cookie if needed
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    userId,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
