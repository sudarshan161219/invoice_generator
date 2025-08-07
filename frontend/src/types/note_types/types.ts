export type NoteType = "general" | "invoiceRelated";

export type noteDTO = {
  title: string;
  content: string;
  label: {
    name: string;
    color: string;
  };
  noteType: NoteType;

  clientId?: number;
  invoiceId?: number;
};
