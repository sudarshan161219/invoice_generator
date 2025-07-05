// /api/
import api from "@/lib/api";
// import type { Client } from "../types/client";
import {
  type ClientCreateForm,
} from "@/modules/createClient/services";

export const createClient = async (data: ClientCreateForm) => {
  const res = await api.post("/clients/create", data);
  return res.data;
};
