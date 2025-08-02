import api from "@/lib/api/api";
import type { ForgotPasswordForm } from "../types";

export const forgotPassword_post = async (data: ForgotPasswordForm) => {
  const res = await api.post("/auth/forgot-password", data);
  return res.data;
};
