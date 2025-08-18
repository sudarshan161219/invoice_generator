import api from "@/lib/api/api";
import { type ClientCreateForm } from "@/types/clients_types/types";

export const createClient = async (data: ClientCreateForm) => {
  const res = await api.post("/clients/create", data);
  return res.data;
};
