import { injectable } from "inversify";
import { prisma } from "../utils/prismaClient";
import { ICreateInvoiceDTO } from "../types/invoice.types";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../errors/AppError";

@injectable()
export class InvoiceService {
  async create(userId: number, clientId: number, data: ICreateInvoiceDTO) {
    try {
      const invoice = await prisma.invoice.create({
        data: {
          ...data,
          dueDate: new Date(data.dueDate),
          user: { connect: { id: userId } },
          client: { connect: { id: clientId } },
        },
      });

      return invoice;
    } catch (err) {
      throw new AppError({
        message: "Failed to create invoice. Please try again later.",
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        code: "INVOICE_CREATION_FAILED",
        debugMessage: err instanceof Error ? err.message : String(err),
        cause: err instanceof Error ? err : undefined,
      });
    }
  }

  async getAll(userId: number) {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    // const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    return invoices;
  }

  async getInvoiceStats(userId: number) {
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    let total = 0;
    let paid = 0;
    let pending = 0;
    let overdue = 0;

    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    for (const invoice of invoices) {
      total += invoice.amount;

      if (invoice.paid) {
        paid += invoice.amount;
        paidCount++;
      } else if (invoice.dueDate < now) {
        overdue += invoice.amount;
        overdueCount++;
      } else {
        pending += invoice.amount;
        pendingCount++;
      }
    }

    const toFixedPercent = (value: number) =>
      total === 0 ? 0 : parseFloat(((value / total) * 100).toFixed(2));

    const messages = {
      total:
        total > 10000
          ? "Revenue is improving, keep it up!"
          : "Monitor your cash flow regularly.",
      paid:
        paidCount > 0 ? "Payments are on track." : "No payments received yet.",
      pending:
        pendingCount > 0 ? "Payments awaiting action." : "No pending invoices.",
      overdue:
        overdueCount > 0
          ? "Follow up with clients to reduce delays."
          : "No overdue invoices. Great job!",
    };

    return {
      invoices,
      total,
      paid,
      pending,
      overdue,
      counts: {
        total: invoices.length,
        paid: paidCount,
        pending: pendingCount,
        overdue: overdueCount,
      },
      percentages: {
        paid: toFixedPercent(paid),
        pending: toFixedPercent(pending),
        overdue: toFixedPercent(overdue),
      },
      messages,
    };
  }

  async getById(id: number, userId: number) {
    const invoice = await prisma.invoice.findFirst({
      where: { id, userId },
    });

    if (!invoice) {
      throw new AppError({
        message: "Invoice not found.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "INVOICE_NOT_FOUND",
        debugMessage: `No invoice with id ${id} found for user ${userId}`,
      });
    }

    return invoice;
  }

  async update(id: number, data: Partial<ICreateInvoiceDTO>, userId: number) {
    const invoice = await prisma.invoice.findFirst({ where: { id, userId } });

    if (!invoice) {
      throw new AppError({
        message:
          "Invoice not found or you do not have permission to update it.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "INVOICE_NOT_FOUND_OR_UNAUTHORIZED",
        debugMessage: `No invoice with id ${id} found for user ${userId} during update`,
      });
    }

    return prisma.invoice.update({
      where: { id },
      data,
    });
  }

  async delete(id: number, userId: number) {
    const invoice = await prisma.invoice.findFirst({ where: { id, userId } });

    if (!invoice) {
      throw new AppError({
        message:
          "Invoice not found or you do not have permission to delete it.",
        statusCode: StatusCodes.NOT_FOUND,
        code: "INVOICE_NOT_FOUND_OR_UNAUTHORIZED",
        debugMessage: `No invoice with id ${id} found for user ${userId} during delete`,
      });
    }

    return prisma.invoice.delete({
      where: { id },
    });
  }
}
