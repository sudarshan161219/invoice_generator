export interface IUploadAttachmentDTO {
  filename: string;
  url: string;
  key: string;
  size: number;
  mimeType: string;
  userId: number;
  type: string;
  clientId?: number;
  invoiceId?: number;
}
