export interface ICreateClientDTO {
  name: string;
  email: `${string}@${string}`;
  phone?: string;
  company?: string;
  address?: string;
  billingAddress?: string;
  shippingAddress?: string;
  website?: string;
  imageUrl?: string;

  status?: "active" | "inactive" | "prospect";

  // Payment terms: allow predefined or custom string
  paymentTerms?: "net15" | "net30" | "net45" | "dueOnReceipt" | string;

  // Currency: allow predefined or ISO code as string
  currency?: "USD" | "EUR" | "INR" | "GBP" | string;

  // Category type: predefined label for UI grouping
  categoryType?: "retail" | "wholesale" | "corporate" | string;

  // Category name: user-defined or predefined
  category?: string;

  // Optional array of note contents to create
  notes?: {
    content: string;
  }[];

  // Tags as array of strings (custom or predefined)
  tags?: {
    name: string;
    color?: string;
  }[];
}
