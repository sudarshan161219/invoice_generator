import api from "@/lib/api/api";
import type { ResetPasswordForm } from "../types/types";

export const resetPassword_post = async (data: ResetPasswordForm) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};
