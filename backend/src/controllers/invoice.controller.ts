import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "../types/types";
import { InvoiceService } from "../services/invoice.service";
import { AppError } from "../errors/AppError";
// import { AuthRequest } from "../types/express";
import { AuthRequest } from "../types/auth.types";

@injectable()
export class InvoiceController {
  constructor(
    @inject(TYPES.InvoiceService) private invoiceService: InvoiceService
  ) {}

  async handleCreateInvoice(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { clientId, ...data } = req.body;

      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "USER_ID_MISSING",
        });
      }

      if (!clientId) {
        throw new AppError({
          message: "Client ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "CLIENT_ID_MISSING",
        });
      }

      const invoice = await this.invoiceService.create(userId, clientId, data);
      res.status(StatusCodes.CREATED).json(invoice);
    } catch (err) {
      next(
        new AppError({
          message: "Failed to create invoice.",
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          code: "INVOICE_CREATE_FAILED",
          debugMessage: err instanceof Error ? err.message : String(err),
          cause: err instanceof Error ? err : undefined,
        })
      );
    }
  }

  async handleGetAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "USER_ID_MISSING",
        });
      }

      const invoices = await this.invoiceService.getAll(userId);
      res.status(StatusCodes.OK).json(invoices);
    } catch (err) {
      next(
        new AppError({
          message: "Failed to fetch invoices.",
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          code: "INVOICE_FETCH_FAILED",
          debugMessage: err instanceof Error ? err.message : String(err),
          cause: err instanceof Error ? err : undefined,
        })
      );
    }
  }

  async handleGetInvoiceStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "USER_ID_MISSING",
        });
      }
      const invoices = await this.invoiceService.getAll(userId);
      res.status(StatusCodes.OK).json(invoices);
    } catch (error) {
      next(error);
    }
  }

  async handleGetById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "USER_ID_MISSING",
        });
      }

      const id = parseInt(req.params.id);
      const invoice = await this.invoiceService.getById(id, userId);

      if (!invoice) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "USER_ID_MISSING",
        });
      }

      res.status(StatusCodes.OK).json(invoice);
    } catch (error) {
      next(error);
    }
  }

  async handleUpdate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "USER_ID_MISSING",
        });
      }

      const id = parseInt(req.params.id);
      const updated = await this.invoiceService.update(id, req.body, userId);
      res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async handleDelete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "USER_ID_MISSING",
        });
      }

      const id = parseInt(req.params.id);
      const deleted = await this.invoiceService.delete(id, userId);
      res.status(StatusCodes.OK).json({ message: "Invoice deleted", deleted });
    } catch (error) {
      next(error);
    }
  }
}
