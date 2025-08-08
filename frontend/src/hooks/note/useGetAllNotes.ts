import { useQuery } from "@tanstack/react-query";
import { getAllNotes } from "@/lib/api/note/getAll.note.api";
import type { ids } from "@/types/note_types/types";

export const useGetAllNotes = (params: ids) => {
  const queryKey = ["notes", params.clientId, params.invoiceId];

  return useQuery({
    queryKey,
    queryFn: () => getAllNotes(params),
    enabled: Boolean(params.clientId || params.invoiceId), // Only fetch if at least one ID is provided
  });
};
