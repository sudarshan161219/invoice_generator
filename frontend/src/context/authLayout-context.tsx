import type { AuthLayoutContextType } from "@/types/authlayout";
import { createContext } from "react";

export const AuthLayoutContext = createContext<
  AuthLayoutContextType | undefined
>(undefined);
