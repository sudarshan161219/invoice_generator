import { Request, Response, NextFunction } from "express";
import { ClientService } from "../services/client.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../types/types";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError";
import { AuthRequest } from "../types/auth.types";

@injectable()
export class ClientController {
  constructor(
    @inject(TYPES.ClientService) private clientService: ClientService
  ) {}

  async handleCreateClient(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "You must be logged in to create a client.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "User ID missing in AuthRequest object",
        });
      }

      const client = await this.clientService.create(userId, req.body);
      res.status(StatusCodes.CREATED).json(client);
    } catch (err) {
      next(err);
    }
  }

  // async handleGetAll(req: AuthRequest, res: Response, next: NextFunction) {
  //   try {
  //     const userId = req.user?.id;
  //     const page = Math.max(1, Number(req.query.page) || 1);
  //     const limit = Math.min(100, Number(req.query.limit) || 10);
  //     const noCache = String(req.query.noCache).toLowerCase() === "true";

  //     if (!userId) {
  //       throw new AppError({
  //         message: "Please login to view your clients.",
  //         statusCode: StatusCodes.UNAUTHORIZED,
  //         code: "UNAUTHORIZED_ACCESS",
  //         debugMessage: "User ID missing in AuthRequest object",
  //       });
  //     }

  //     const clients = await this.clientService.getAll({
  //       userId,
  //       page,
  //       limit,
  //       noCache,
  //     });
  //     res.status(StatusCodes.OK).json({
  //       success: true,
  //       page,
  //       limit,
  //       data: clients,
  //     });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  async handleGetAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const page = Math.max(1, Number(req.query.page) || 1);
      const limit = Math.min(100, Number(req.query.limit) || 10);
      const noCache = String(req.query.noCache).toLowerCase() === "true";

      const search = req.query.search ? String(req.query.search) : undefined;
      const sortBy = req.query.sortBy as
        | "createdAt"
        | "name"
        | "email"
        | "company"
        | "status"
        | undefined;
      const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;
      const status = req.query.status as
        | "active"
        | "inactive"
        | "prospect"
        | undefined;

      // Parse multiple values for filters
      const categoryIds = req.query.categoryIds
        ? String(req.query.categoryIds).split(",").map(Number).filter(Boolean)
        : undefined;

      const tagIds = req.query.tagIds
        ? String(req.query.tagIds).split(",").map(Number).filter(Boolean)
        : undefined;

      const paymentTermIds = req.query.paymentTermIds
        ? String(req.query.paymentTermIds)
            .split(",")
            .map(Number)
            .filter(Boolean)
        : undefined;

      const currencyIds = req.query.currencyIds
        ? String(req.query.currencyIds).split(",").map(Number).filter(Boolean)
        : undefined;

      if (!userId) {
        throw new AppError({
          message: "Please login to view your clients.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "User ID missing in AuthRequest object",
        });
      }

      const clients = await this.clientService.getAll({
        userId,
        page,
        limit,
        noCache,
        search,
        sortBy,
        sortOrder,
        status,
        categoryIds,
        tagIds,
        paymentTermIds,
        currencyIds,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        page,
        limit,
        data: clients,
      });
    } catch (err) {
      next(err);
    }
  }

  async handleGetById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "Please login to access client details.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "User ID missing in AuthRequest object",
        });
      }

      const id = parseInt(req.params.id);
      const client = await this.clientService.getById(id, userId);

      if (!client) {
        throw new AppError({
          message: "Sorry, we couldn't find that client.",
          statusCode: StatusCodes.NOT_FOUND,
          code: "CLIENT_NOT_FOUND",
          debugMessage: `No client found with id ${id} for user ${userId}`,
        });
      }

      res.status(StatusCodes.OK).json(client);
    } catch (err) {
      next(err);
    }
  }

  async handleUpdate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "You need to be logged in to update client information.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "User ID missing in AuthRequest object",
        });
      }

      const id = parseInt(req.params.id);
      const updated = await this.clientService.update(id, req.body, userId);
      res.status(StatusCodes.OK).json(updated);
    } catch (err) {
      next(err);
    }
  }

  async handleDelete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "You must be logged in to delete a client.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "User ID missing in AuthRequest object",
        });
      }

      const id = parseInt(req.params.id);
      const deletedClient = await this.clientService.delete(id, userId);
      res
        .status(StatusCodes.OK)
        .json({ message: "Client deleted", deleted: deletedClient });
    } catch (err) {
      next(err);
    }
  }

  async handleAddClientNote(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { content } = req.body;
      const clientId = parseInt(req.params.id);
      if (!userId) {
        throw new AppError({
          message: "You must be logged in to add a note.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "User ID missing in AuthRequest object",
        });
      }

      if (!clientId || typeof clientId !== "number") {
        throw new AppError({
          message: "Client ID is required and must be a number.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "INVALID_CLIENT_ID",
        });
      }

      if (!content || typeof content !== "string") {
        throw new AppError({
          message: "Note content is required.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "INVALID_NOTE_CONTENT",
        });
      }

      const note = await this.clientService.addNoteToClient(
        userId,
        clientId,
        content
      );

      res.status(StatusCodes.CREATED).json({
        message: "Note added successfully.",
        data: note,
      });
    } catch (err) {
      next(err);
    }
  }

  async handleUpdateClientNote(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { content } = req.body;
      const noteId = parseInt(req.params.id);
      if (!userId) {
        throw new AppError({
          message: "You must be logged in to add a note.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "User ID missing in AuthRequest object",
        });
      }

      if (!noteId || typeof noteId !== "number") {
        throw new AppError({
          message: "Note ID is required and must be a number.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "INVALID_NOTE_ID",
        });
      }

      if (!content || typeof content !== "string") {
        throw new AppError({
          message: "Note content is required.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "INVALID_NOTE_CONTENT",
        });
      }

      const note = await this.clientService.updateClientNote(
        userId,
        noteId,
        content
      );

      res.status(StatusCodes.CREATED).json({
        message: "Note updated successfully.",
        data: note,
      });
    } catch (err) {
      next(err);
    }
  }

  async handleDeleteClientNote(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const noteId = parseInt(req.params.id);
      if (!userId) {
        throw new AppError({
          message: "You must be logged in to add a note.",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "UNAUTHORIZED_ACCESS",
          debugMessage: "User ID missing in AuthRequest object",
        });
      }

      if (!noteId || typeof noteId !== "number") {
        throw new AppError({
          message: "Note ID is required and must be a number.",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "INVALID_NOTE_ID",
        });
      }

      await this.clientService.deleteClientNote(userId, noteId);

      res.status(StatusCodes.CREATED).json({
        message: "Note deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  }
}
