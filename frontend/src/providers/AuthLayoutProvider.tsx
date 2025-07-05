import { useState, type ReactNode } from "react";
import { AuthLayoutContext } from "../context/authLayout-context";
import type { AuthLayoutContextType } from "@/types/authlayout";

export const AuthLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const toggleLayout = () => {
    setIsLogin((prev) => !prev);
  };

  const contextValue: AuthLayoutContextType = {
    isLogin,
    toggleLayout,
    setIsLogin,
  };

  return (
    <AuthLayoutContext.Provider value={contextValue}>
      {children}
    </AuthLayoutContext.Provider>
  );
};
