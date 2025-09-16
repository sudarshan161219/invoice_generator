type Category = {
  id: number;
  name: string;
  color: string;
  isDefault?: boolean;
};

export type ClientFormState = {
  name: string;
  email: string;
  phone?: string;
  company?: string;

  // Addresses
  billingAddress?: string;
  shippingAddress?: string;

  // Business info
  website?: string;
  taxId?: string;
  taxIdType?: string;

  // Status / categorization
  status: "active" | "inactive" | "prospect";
  category?: Category; // could also be number if you link to Category model

  // Extra info
  socialLinks?: Record<string, string>; // e.g. { twitter: "url", linkedin: "url" }

  imageUrl?: string;

  // Meta
  createdAt: string;
  updatedAt: string;
  userId: number;
};
