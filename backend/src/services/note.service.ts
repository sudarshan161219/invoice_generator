import { injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../utils/prismaClient";
import { AppError } from "../errors/AppError";
import redisClient from "../config/redis"; // redisClient instance
import { noteDTO } from "../types/note.types"; // define this type separately

@injectable()
export class NoteService {
  async create(userId: number, data: noteDTO) {
    try {
      const { clientId, invoiceId, ...rest } = data;

      if (!clientId && !invoiceId) {
        throw new AppError({
          message: "Either clientId or invoiceId must be provided.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "MISSING_RELATION_ID",
        });
      }

      const note = await prisma.clientNote.create({
        data: {
          ...rest,
          userId,
          clientId: clientId ?? null,
          invoiceId: invoiceId ?? null,
        },
      });

      await redisClient.del(`notes:user:${userId}:*`);

      return note;
    } catch (error) {
      throw new AppError({
        message: "Failed to create note.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "NOTE_CREATION_FAILED",
        debugMessage: "Error in NoteService.create()",
        cause: error as Error,
      });
    }
  }

  async getAll(
    userId: number,
    filters?: { clientId?: number; invoiceId?: number }
  ) {
    const { clientId, invoiceId } = filters || {};
    const cacheKey = `notes:user:${userId}:client:${
      clientId ?? "any"
    }:invoice:${invoiceId ?? "any"}`;

    try {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);

      const notes = await prisma.clientNote.findMany({
        where: {
          userId,
          ...(clientId ? { clientId } : {}),
          ...(invoiceId ? { invoiceId } : {}),
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      await redisClient.setEx(cacheKey, 60 * 5, JSON.stringify(notes));
      return notes;
    } catch (error) {
      throw new AppError({
        message: "Failed to fetch notes.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "FETCH_NOTES_FAILED",
        debugMessage: "Error in NoteService.getAll()",
        cause: error as Error,
      });
    }
  }

  async getById(noteId: number) {
    try {
      const note = await prisma.clientNote.findUnique({
        where: { id: noteId },
      });

      if (!note) {
        throw new AppError({
          message: "Note not found.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "NOTE_NOT_FOUND",
        });
      }

      return note;
    } catch (error) {
      throw new AppError({
        message: "Failed to retrieve note.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "FETCH_NOTE_FAILED",
        debugMessage: "Error in NoteService.getById()",
        cause: error as Error,
      });
    }
  }

  async updateNote(noteId: number, data: noteDTO) {
    try {
      const existing = await prisma.clientNote.findUnique({
        where: { id: noteId },
      });
      if (!existing) {
        throw new AppError({
          message: "Note not found.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "NOTE_NOT_FOUND",
        });
      }

      const updated = await prisma.clientNote.update({
        where: { id: noteId },
        data,
      });

      // Invalidate cache
      await redisClient.del(`notes:user:${existing.userId}:*`);

      return updated;
    } catch (error) {
      throw new AppError({
        message: "Failed to update note.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "UPDATE_NOTE_FAILED",
        debugMessage: "Error in NoteService.updateNote()",
        cause: error as Error,
      });
    }
  }

  async deleteNote(noteId: number) {
    try {
      const note = await prisma.clientNote.findUnique({
        where: { id: noteId },
      });
      if (!note) {
        throw new AppError({
          message: "Note not found.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "NOTE_NOT_FOUND",
        });
      }

      await prisma.clientNote.delete({ where: { id: noteId } });

      // Invalidate cache
      await redisClient.del(`notes:user:${note.userId}:*`);

      return { message: "Note deleted successfully." };
    } catch (error) {
      throw new AppError({
        message: "Failed to delete note.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "DELETE_NOTE_FAILED",
        debugMessage: "Error in NoteService.deleteNote()",
        cause: error as Error,
      });
    }
  }
}
