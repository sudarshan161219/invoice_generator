import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient";
import { ICreatePaymentDTO } from "../types/payment.types";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError";

@injectable()
export class PaymentService {
  async create(invoiceId: number, data: ICreatePaymentDTO) {
    console.log(invoiceId);
    try {
      return await prisma.payment.create({
        data: {
          ...data,
          invoice: { connect: { id: invoiceId } },
        },
      });
    } catch (err) {
      throw new AppError({
        message: "Failed to create payment. Please try again.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "PAYMENT_CREATION_FAILED",
        debugMessage: err instanceof Error ? err.message : String(err),
        cause: err instanceof Error ? err : undefined,
      });
    }
  }

  async getPayments(invoiceId: number) {
    try {
      return await prisma.payment.findMany({
        where: { invoiceId },
        orderBy: { createdAt: "desc" },
      });
    } catch (err) {
      throw new AppError({
        message: "Unable to fetch payments right now.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "PAYMENT_FETCH_FAILED",
        debugMessage: err instanceof Error ? err.message : String(err),
        cause: err instanceof Error ? err : undefined,
      });
    }
  }

  async update(
    paymentId: number,
    userId: number,
    data: { note?: string; method?: string }
  ) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { invoice: true },
    });

    if (!payment || payment.invoice.userId !== userId) {
      throw new AppError({
        message:
          "Payment not found or you do not have permission to update it.",
        statusCode: StatusCodes.UNAUTHORIZED,
        code: "PAYMENT_NOT_FOUND_OR_UNAUTHORIZED",
        debugMessage: `Payment ID: ${paymentId}, User ID: ${userId}`,
      });
    }

    try {
      return prisma.payment.update({
        where: { id: paymentId },
        data: {
          note: data.note,
          method: data.method,
        },
      });
    } catch (error) {
      throw new AppError({
        message: "Failed to update payment.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "PAYMENT_UPDATE_FAILED",
        debugMessage: error instanceof Error ? error.message : String(error),
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  async delete(paymentId: number, userId: number) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { invoice: true },
    });

    if (!payment || payment.invoice.userId !== userId) {
      throw new AppError({
        message:
          "Payment not found or you do not have permission to delete it.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "PAYMENT_NOT_FOUND_OR_UNAUTHORIZED",
        debugMessage: `Payment ID: ${paymentId}, User ID: ${userId}`,
      });
    }

    try {
      return await prisma.payment.delete({
        where: { id: paymentId },
      });
    } catch (err) {
      throw new AppError({
        message: "Failed to delete payment.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "PAYMENT_DELETE_FAILED",
        debugMessage: err instanceof Error ? err.message : String(err),
        cause: err instanceof Error ? err : undefined,
      });
    }
  }
}
