// import api from "@/lib/api";
// import { type ClientsApiResponse } from "../types/clients";

// export const getAllClients = async () => {
//   const res: ClientsApiResponse = await api.get("/clients/getAll");
//   return res.data;
// };

import api from "@/lib/api";
import { type ClientsApiResponse } from "../types/clients";

export const getAllClients = async (): Promise<ClientsApiResponse> => {
  const res = await api.get<ClientsApiResponse>("/clients/getAll");
  return res.data; // ✅ This includes success, page, limit, and data
};
