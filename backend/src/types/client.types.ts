export interface ICreateClientDTO {
  name: string;
  email: `${string}@${string}`;
  phone?: string;
  company?: string;
  address?: string;
  imageUrl?: string;

  // Optional array of note contents to create
  notes?: {
    content: string;
  }[];
}
