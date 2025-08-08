import api from "@/lib/api/api";
import type { ids } from "@/types/note_types/types";

export const getAllNotes = async ({ clientId, invoiceId }: ids) => {
  const params: Record<string, number> = {};

  if (clientId !== undefined) params.clientId = clientId;
  if (invoiceId !== undefined) params.invoiceId = invoiceId;

  const res = await api.get("/note/get", { params });
  return res.data.data;
};
