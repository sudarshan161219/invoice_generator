import api from "@/lib/api/api";
import { type ClientCreateForm } from "@/modules/createClient/services";

export const createClient = async (data: ClientCreateForm) => {
  const res = await api.post("/clients/create", data);
  return res.data.data;
};
