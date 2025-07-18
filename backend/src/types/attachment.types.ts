export interface IUploadAttachmentDTO {
  filename: string;
  url: string;
  size: number;
  mimeType: string;
  userId: number;
   type: string; 
  clientId?: number;
  invoiceId?: number;
}
