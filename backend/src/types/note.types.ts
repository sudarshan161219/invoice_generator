export type noteDTO = {
  title: string;
  content: string;
  label: {
    name: string;
    color: string;
  };
  noteType: "general" | "invoiceRelated";
  clientId?: number;
  invoiceId?: number;
};
