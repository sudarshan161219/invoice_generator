export interface ClientInfo {
  name: string;
  email: string;
  phone: number;
  company: string;
  address: string;
  notes: string;
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  client: ClientInfo;
  items: LineItem[];
  notes?: string;
}
