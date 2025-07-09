export interface Client {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  notes?: [];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  userId: number;
}
