import { Router, Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../types/types";
import { AuthFileRequest } from "../types/express";
import { AttachmentService } from "../services/attachment.service";
import { AppError } from "../errors/AppError";
import { StatusCodes } from "http-status-codes";

@injectable()
export class AttachmentController {
  constructor(
    @inject(TYPES.AttachmentService)
    private attachmentService: AttachmentService
  ) {}

  async handleUpload(req: AuthFileRequest, res: Response, next: NextFunction) {
    try {
      const files = req.files as Express.Multer.File[];
      const userId = req.user?.id;
      const { clientId, invoiceId, type } = req.body;

      if (!files || files.length === 0) {
        throw new AppError({
          message: "No file uploaded.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "FILE_MISSING",
          debugMessage: "Expected 'files' in form-data, got none.",
        });
      }

      if (!userId) {
        throw new AppError({
          message: "Access denied. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "Missing or invalid userId from request object.",
        });
      }

      if (!type || typeof type !== "string") {
        throw new AppError({
          message: "Attachment type is required.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "MISSING_ATTACHMENT_TYPE",
          debugMessage: "Expected 'type' in body as string.",
        });
      }

      const uploadedFiles = [];

      for (const file of files) {
        const { key, url } = await this.attachmentService.uploadToR2(
          file.buffer,
          file.originalname,
          file.mimetype
        );

        const saved = await this.attachmentService.upload({
          filename: file.originalname,
          url,
          size: file.size,
          mimeType: file.mimetype,
          type,
          userId,
          clientId: clientId ? Number(clientId) : undefined,
          invoiceId: invoiceId ? Number(invoiceId) : undefined,
        });

        uploadedFiles.push(saved);
      }

      res.status(StatusCodes.CREATED).json({
        message: "Files uploaded successfully.",
        data: uploadedFiles,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAttachments(
    req: AuthFileRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user?.id;

      if (!userId) {
        throw new AppError({
          message: "Access denied. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "Missing or invalid userId from request object.",
        });
      }

      if (!id) {
        throw new AppError({
          message: "Client ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "MISSING_CLIENT_ID",
        });
      }

      const attachments = await this.attachmentService.getAttachmentsByClient(
        id,
        userId
      );

      res.status(StatusCodes.OK).json({ attachments });
    } catch (err) {
      next(err);
    }
  }
}
