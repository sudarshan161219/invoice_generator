export interface Clients {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ClientsApiResponse {
  data: {
    data: Clients[];
    meta: PaginationMeta;
    message: string | null;
  };
  limit: number;
  page: number;
  success: boolean;
}


