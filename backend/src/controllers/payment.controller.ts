import { Request, Response, NextFunction } from "express";
import { inject, injectable } from "inversify";
import { StatusCodes } from "http-status-codes";
import { TYPES } from "../types/types";
import { PaymentService } from "../services/payment.service";
import { AppError } from "../errors/AppError";
import { AuthRequest } from "../types/auth.types";

@injectable()
export class PaymentController {
  constructor(
    @inject(TYPES.PaymentService) private paymentService: PaymentService
  ) {}

  async handleCreatePayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      const { invoiceId, ...data } = req.body;
      // const invoiceId = parseInt(req.params.invoiceId);

      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "USER_ID_MISSING",
        });
      }

      if (!invoiceId) {
        throw new AppError({
          message: "Invoice ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "Invoice_ID_MISSING",
        });
      }

      const payment = await this.paymentService.create(invoiceId, data);
      res.status(StatusCodes.CREATED).json(payment);
    } catch (error) {
      next(error);
    }
  }

  async handleGetPayments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const invoiceId = parseInt(req.params.id);

      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "USER_ID_MISSING",
        });
      }

      if (isNaN(invoiceId)) {
        throw new AppError({
          message: "Invoice ID is required",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "Invoice_ID_MISSING",
        });
      }

      const payments = await this.paymentService.getPayments(invoiceId);
      res.status(StatusCodes.OK).json(payments);
    } catch (error) {
      next(error);
    }
  }

  async handleUpdatePayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "USER_ID_MISSING",
        });
      }
      const id = parseInt(req.params.id);
      const { note, method } = req.body;

      const updated = await this.paymentService.update(id, userId, {
        note,
        method,
      });
      res.status(StatusCodes.OK).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async handleDeletePayment(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError({
          message: "USER ID is required",
          statusCode: StatusCodes.UNAUTHORIZED,
          code: "USER_ID_MISSING",
        });
      }

      const paymentId = parseInt(req.params.id);
      if (isNaN(paymentId)) {
        throw new AppError({
          message: "Invalid Payment ID",
          statusCode: StatusCodes.BAD_REQUEST,
          code: "Payment_ID_Invalid",
        });
      }

      const deleted = await this.paymentService.delete(paymentId, userId);
      res.status(StatusCodes.OK).json({ message: "Payment deleted", deleted });
    } catch (error) {
      next(error);
    }
  }
}
