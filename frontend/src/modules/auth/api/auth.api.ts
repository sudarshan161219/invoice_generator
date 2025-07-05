import api from "@/lib/api";
import type { IRegisterDTO } from "@/types/register";
import type { ILoginDTO } from "@/types/login";

export const registerUser = async (data: IRegisterDTO) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: ILoginDTO) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const googleOAuth = async (code: string, mode: string) => {
  const res = await api.post("/auth/google", { code, mode });
  return res.data;
};

export const githubOAuth = async (code: string, mode: string) => {
  const res = await api.post("/auth/github", { code, mode });
  return res.data;
};
