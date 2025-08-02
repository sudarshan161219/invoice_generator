export type Note = {
  id: number;
  content: string;
  createdAt: string;
};

export type File = {
  id: number;
  name: string;
  url: string;
};

export type Props = {
  notes: Note[];
  files: File[];
  onEditNote: (id: number, newContent: string) => void;
};

export type UploadAttachmentResponse = {
  message: string;
  attachment: {
    id: number;
    filename: string;
    url: string;
    size: number;
    mimeType: string;
    type: string;
    userId: number;
    clientId?: number;
    invoiceId?: number;
    createdAt: string;
    updatedAt: string;
  };
};
