import api from "@/lib/api/api";
import type { ClientFormState } from "@/types/clients_types/ClientFormState";

export async function updateClient(id: number, data: Partial<ClientFormState>) {
  const res = await api.patch(`/clients/update/${id}`, data);
  return res.data;
}
