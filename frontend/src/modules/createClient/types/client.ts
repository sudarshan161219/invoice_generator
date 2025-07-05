export interface ClientNote {
  id: number;
  content: string;
  createdAt: string;
  clientId: number;
  userId: number;
}

export interface Client {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: ClientNote[];
  imageUrl?: string;
}

export interface ApiErrorResponse {
  message: string;
  code?: string;
  statusCode?: number;
}
