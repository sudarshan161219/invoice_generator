import { useContext } from "react";
import { AuthLayoutContext } from "@/context/authLayout-context";
import type { AuthLayoutContextType } from "@/types/authlayout";

export const useAuthLayout = (): AuthLayoutContextType => {
  const context = useContext(AuthLayoutContext);
  if (!context)
    throw new Error(
      " useAuthLayout  must be used within an AuthLayoutProvider"
    );
  return context;
};
