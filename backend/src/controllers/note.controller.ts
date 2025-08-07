import { injectable, inject } from "inversify";
import { StatusCodes } from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { NoteService } from "../services/note.service";
import { TYPES } from "../types/types";
import { AppError } from "../errors/AppError";
import { AuthRequest } from "../types/express";

@injectable()
export class NoteController {
  constructor(@inject(TYPES.NoteService) private noteService: NoteService) {}

  async handleCreate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      const { title, content, label, noteType, clientId, invoiceId } = req.body;

      if (!userId) {
        throw new AppError({
          message: "Access denied. Please log in again.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "Missing or invalid userId from request object.",
        });
      }

      if (!content?.trim()) {
        throw new AppError({
          message: "Note content is required.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "NOTE_CONTENT_REQUIRED",
        });
      }

      if (!clientId && !invoiceId) {
        throw new AppError({
          message: "Note must belong to either a client or an invoice.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "NOTE_TARGET_MISSING",
        });
      }

      const note = await this.noteService.create(userId, {
        title,
        content,
        label,
        noteType,
        clientId,
        invoiceId,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleGetAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async handleGetById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async handleUpdate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }

  async handleDelete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
    } catch (error) {
      next(error);
    }
  }
}
