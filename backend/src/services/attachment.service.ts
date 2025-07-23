import { injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../utils/prismaClient";
import { AppError } from "../errors/AppError";
import { IUploadAttachmentDTO } from "../types/attachment.types";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "../lib/r2";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

@injectable()
export class AttachmentService {
  private bucket = process.env.CF_BUCKET_NAME!;
  private accountId = process.env.CF_ACCOUNT_ID!;

  async generateSignedUrl(attachmentId: number, userId: number) {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment || attachment.userId !== userId) {
      throw new AppError({
        message: "Forbidden",
        statusCode: StatusCodes.FORBIDDEN,
      });
    }

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: attachment?.key,
    });

    const signedUrl = await getSignedUrl(r2, command, {
      expiresIn: 60 * 5, // 5 minutes
    });

    return signedUrl;
  }

  /**
   * Uploads a file to Cloudflare R2 and returns the public URL and key.
   */
  async uploadToR2(fileBuffer: Buffer, fileName: string, mimeType: string) {
    const key = this.generateFileKey(fileName);

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    });

    await r2.send(command);

    return {
      key,
      url: this.buildFileUrl(key),
    };
  }

  /**
   * Validates and saves the uploaded file metadata to the database.
   */
  async upload(data: IUploadAttachmentDTO) {
    try {
      await this.validateLinkedEntities(data.clientId, data.invoiceId);

      const attachment = await prisma.attachment.create({
        data: {
          filename: data.filename,
          url: data.key,
          key: data.key,
          size: data.size,
          mimeType: data.mimeType,
          type: data.type,
          userId: data.userId,
          clientId: data.clientId,
          invoiceId: data.invoiceId,
        },
      });

      return {
        message: "Attachment uploaded successfully.",
        attachment,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;

      throw new AppError({
        message: "Failed to upload attachment.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "ATTACHMENT_UPLOAD_FAILED",
        debugMessage: "Unexpected error in AttachmentService.upload",
        cause: error as Error,
      });
    }
  }

  // ============ PRIVATE HELPERS ============

  /**
   * Validates whether the referenced client and invoice exist.
   */
  private async validateLinkedEntities(clientId?: number, invoiceId?: number) {
    if (clientId) {
      const clientExists = await prisma.client.findUnique({
        where: { id: clientId },
      });
      if (!clientExists) {
        throw new AppError({
          message: "Client not found.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "CLIENT_NOT_FOUND",
          debugMessage: `No client with ID ${clientId}`,
        });
      }
    }

    if (invoiceId) {
      const invoiceExists = await prisma.invoice.findUnique({
        where: { id: invoiceId },
      });
      if (!invoiceExists) {
        throw new AppError({
          message: "Invoice not found.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "INVOICE_NOT_FOUND",
          debugMessage: `No invoice with ID ${invoiceId}`,
        });
      }
    }
  }

  /**
   * Generates a unique file key with folder prefix.
   */
  private generateFileKey(fileName: string): string {
    return `uploads/${randomUUID()}-${fileName}`;
  }

  /**
   * Constructs the full public URL for a stored file.
   */
  private buildFileUrl(key: string): string {
    return `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucket}/${key}`;
  }

  async getAttachmentsByClient(clientId: number, userId: number) {
    const attachments = await prisma.attachment.findMany({
      where: {
        clientId,
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return attachments;
  }

  async updateAttachmentFileName(
    attachmentId: number,
    userId: number,
    filename: string
  ) {
    const attachment = await prisma.attachment.findUnique({
      where: { id: Number(attachmentId) },
    });

    if (!attachment || attachment.userId !== userId) {
      throw new AppError({
        message: "Attachment not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const updated = await prisma.attachment.update({
      where: { id: Number(attachmentId) },
      data: { filename },
    });

    return updated;
  }

  async deleteAttachment(attachmentId: number, userId: number) {
    const attachment = await prisma.attachment.findUnique({
      where: { id: Number(attachmentId) },
    });

    if (!attachment || attachment.userId !== userId) {
      throw new AppError({
        message: "Attachment not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    await r2.send(
      new DeleteObjectCommand({
        Bucket: process.env.CF_BUCKET_NAME!,
        Key: attachment.key,
      })
    );

    await prisma.attachment.delete({
      where: { id: Number(attachmentId) },
    });

    return { success: true };
  }
}
